const Storage = {
    KEYS: {
        MATERIALS: 'cost_calculator_materials',
        PRODUCTS: 'cost_calculator_products',
        HISTORY: 'cost_calculator_history',
        PRICE_HISTORY: 'cost_calculator_price_history'
    },

    // Verificar si Supabase está habilitado y el usuario autenticado
    get useSupabase() {
        return SUPABASE_CONFIG.useSupabase && 
               supabaseClient && 
               Auth && 
               Auth.currentUser;
    },

    // Materials
    async getMaterials() {
        if (this.useSupabase) {
            try {
                const { data, error } = await supabaseClient
                    .from('materials')
                    .select('*')
                    .eq('user_id', Auth.currentUser.id)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    return this.getMaterialsLocal();
                }
                return data || [];
            } catch (error) {
                return this.getMaterialsLocal();
            }
        }
        return this.getMaterialsLocal();
    },

    getMaterialsLocal() {
        const data = localStorage.getItem(this.KEYS.MATERIALS);
        return data ? JSON.parse(data) : [];
    },
    
    async saveMaterial(material) {
        if (this.useSupabase) {
            try {
                const materialData = {
                    ...material,
                    user_id: Auth.currentUser.id,
                    updated_at: new Date().toISOString()
                };

                const { data, error } = await supabaseClient
                    .from('materials')
                    .upsert(materialData, { onConflict: 'id' })
                    .select();

                if (error) {
                    return this.saveMaterialLocal(material);
                }
                
                this.saveMaterialLocal(material);
                const allMaterials = await this.getMaterials();
                return allMaterials;
            } catch (error) {
                return this.saveMaterialLocal(material);
            }
        }
        
        return this.saveMaterialLocal(material);
    },

    saveMaterialLocal(material) {
        const materials = this.getMaterialsLocal();
        const index = materials.findIndex(m => m.id === material.id);
        
        if (index >= 0 && materials[index].cost !== material.cost) {
            this.addPriceHistory(material.id, material.name, materials[index].cost, material.cost);
        }
        
        if (index >= 0) {
            materials[index] = material;
        } else {
            materials.push(material);
        }
        
        localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(materials));
        return materials;
    },
    
    async deleteMaterial(id) {
        if (this.useSupabase) {
            try {
                const { error } = await supabaseClient
                    .from('materials')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', Auth.currentUser.id);

                if (error) {
                    // Error silencioso
                }
            } catch (error) {
                // Error silencioso
            }
        }
        
        // También eliminar de localStorage
        let materials = this.getMaterialsLocal();
        materials = materials.filter(m => m.id !== id);
        localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(materials));
        return materials;
    },

    async updateMaterialStock(materialId, quantityUsed) {
        // Obtener el material actual
        const materials = await this.getMaterials();
        const material = materials.find(m => m.id === materialId);
        
        if (!material) {
            return;
        }
        
        const newStock = material.stock - quantityUsed;
        const updatedMaterial = { ...material, stock: newStock };
        
        await this.saveMaterial(updatedMaterial);
    },
    
    // Products
    async getProducts() {
        if (this.useSupabase) {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .select('*')
                    .eq('user_id', Auth.currentUser.id)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    return this.getProductsLocal();
                }
                
                const materials = await this.getMaterials();
                const productsWithCost = (data || []).map(product => {
                    let totalCost = 0;
                    if (product.recipe && Array.isArray(product.recipe)) {
                        product.recipe.forEach(ing => {
                            const mat = materials.find(m => m.id === ing.materialId);
                            if (mat) {
                                totalCost += ing.quantity * mat.cost;
                            }
                        });
                    }
                    return { ...product, totalCost };
                });
                
                return productsWithCost;
            } catch (error) {
                return this.getProductsLocal();
            }
        }
        return this.getProductsLocal();
    },

    getProductsLocal() {
        const data = localStorage.getItem(this.KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    },
    
    async saveProduct(product) {
        if (this.useSupabase) {
            try {
                const productData = {
                    id: product.id,
                    user_id: Auth.currentUser.id,
                    name: product.name,
                    category: product.category,
                    image: product.image || product.image_url || null,
                    margin: product.margin,
                    price: product.price,
                    recipe: product.recipe,
                    updated_at: new Date().toISOString()
                };

                const { data, error } = await supabaseClient
                    .from('products')
                    .upsert(productData, { onConflict: 'id' })
                    .select();

                if (error) {
                    return this.saveProductLocal(product);
                }
                
                this.saveProductLocal(product);
                const allProducts = await this.getProducts();
                return allProducts;
            } catch (error) {
                return this.saveProductLocal(product);
            }
        }
        
        return this.saveProductLocal(product);
    },

    saveProductLocal(product) {
        const products = this.getProductsLocal();
        const index = products.findIndex(p => p.id === product.id);
        
        if (index >= 0) {
            products[index] = product;
        } else {
            products.push(product);
        }
        
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return products;
    },
    
    async deleteProduct(id) {
        if (this.useSupabase) {
            try {
                const { error } = await supabaseClient
                    .from('products')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', Auth.currentUser.id);

                if (error) {
                    // Error silencioso
                }
            } catch (error) {
                // Error silencioso
            }
        }
        
        let products = this.getProductsLocal();
        products = products.filter(p => p.id !== id);
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return products;
    },
    async getHistory() {
        if (this.useSupabase) {
            try {
                // Intentar primero con user_id
                let query = supabaseClient
                    .from('history')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(100);
                
                try {
                    query = query.eq('user_id', Auth.currentUser.id);
                } catch (e) {
                    // Sin user_id
                }
                
                const { data, error } = await query;
                
                if (error) {
                    return this.getHistoryLocal();
                }
                
                const normalizedData = (data || []).map(entry => ({
                    id: entry.id,
                    type: entry.type,
                    productName: entry.product_name,
                    quantity: entry.quantity,
                    totalCost: entry.total_cost,
                    salePrice: entry.sale_price,
                    profit: entry.profit,
                    date: entry.date,
                    materialsUsed: entry.materials_used
                }));
                
                return normalizedData;
            } catch (error) {
                return this.getHistoryLocal();
            }
        }
        return this.getHistoryLocal();
    },

    getHistoryLocal() {
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },
    async addHistoryEntry(entry) {
        if (this.useSupabase) {
            try {
                const historyData = {
                    type: entry.type || 'production',
                    product_name: entry.productName,
                    quantity: entry.quantity,
                    total_cost: entry.totalCost || 0,
                    sale_price: entry.salePrice || 0,
                    profit: entry.profit || 0,
                    date: new Date().toISOString()
                };

                try {
                    historyData.user_id = Auth.currentUser.id;
                } catch (e) {
                    // Sin user_id
                }

                const { error } = await supabaseClient
                    .from('history')
                    .insert(historyData);

                if (error) {
                    // Error silencioso
                }
            } catch (error) {
                // Error silencioso
            }
        }
        
        // También guardar en localStorage
        const history = this.getHistoryLocal();
        history.unshift(entry);
        if (history.length > 100) {
            history.splice(100);
        }
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    },
    clearHistory() {
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify([]));
    },
    getPriceHistory() {
        const data = localStorage.getItem(this.KEYS.PRICE_HISTORY);
        return data ? JSON.parse(data) : [];
    },
    addPriceHistory(materialId, materialName, oldPrice, newPrice) {
        const history = this.getPriceHistory();
        history.unshift({
            id: Date.now(),
            materialId,
            materialName,
            oldPrice,
            newPrice,
            date: new Date().toISOString()
        });
        if (history.length > 50) {
            history.splice(50);
        }
        localStorage.setItem(this.KEYS.PRICE_HISTORY, JSON.stringify(history));
    },
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar');
            return;
        }
        const headers = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        for (const row of data) {
            const values = headers.map(header => {
                let cell = row[header];
                if (typeof cell === 'object') {
                    cell = JSON.stringify(cell);
                }
                if (cell && (String(cell).includes(',') || String(cell).includes('"'))) {
                    cell = '"' + String(cell).replace(/"/g, '""') + '"';
                }
                return cell || '';
            });
            csvRows.push(values.join(','));
        }
        
        const csv = csvRows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename + '_' + new Date().toISOString().split('T')[0] + '.csv';
        link.click();
    },
    async exportAllData() {
        const allData = {
            materials: await this.getMaterials(),
            products: await this.getProducts(),
            history: await this.getHistory(),
            priceHistory: this.getPriceHistory(),
            exportDate: new Date().toISOString()
        };
        const json = JSON.stringify(allData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bonitas_creaciones_backup_' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
    },
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.materials) {
                localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(data.materials));
            }
            if (data.products) {
                localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(data.products));
            }
            if (data.history) {
                localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(data.history));
            }
            if (data.priceHistory) {
                localStorage.setItem(this.KEYS.PRICE_HISTORY, JSON.stringify(data.priceHistory));
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};