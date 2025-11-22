const Storage = {
    KEYS: {
        MATERIALS: 'cost_calculator_materials',
        PRODUCTS: 'cost_calculator_products',
        HISTORY: 'cost_calculator_history',
        PRICE_HISTORY: 'cost_calculator_price_history'
    },

    // Helper to check connection
    get isOnline() {
        return SupabaseClient && SupabaseClient.isConnected;
    },

    // Materials
    async getMaterials() {
        if (this.isOnline) {
            const { data, error } = await SupabaseClient.client.from('materials').select('*');
            if (!error) return data;
            console.error('Error fetching materials from Supabase:', error);
        }
        const data = localStorage.getItem(this.KEYS.MATERIALS);
        return data ? JSON.parse(data) : [];
    },

    async saveMaterial(material) {
        if (this.isOnline) {
            // Upsert to Supabase
            const { data, error } = await SupabaseClient.client
                .from('materials')
                .upsert(material)
                .select();

            if (error) {
                console.error('Error saving material to Supabase:', error);
                alert('Error al guardar en la nube. Se guardará localmente.');
            }
        }

        // Always save locally as backup/cache
        const materials = await this.getMaterialsLocal();
        const index = materials.findIndex(m => m.id === material.id);

        // Track price history locally (Supabase has its own logic if we wanted triggers, but let's keep it simple)
        if (index >= 0 && materials[index].cost !== material.cost) {
            this.addPriceHistory(material.id, material.name, materials[index].cost, material.cost);
        }

        if (index >= 0) {
            materials[index] = material;
        } else {
            materials.push(material);
        }

        localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(materials));
        return this.isOnline ? await this.getMaterials() : materials;
    },

    async deleteMaterial(id) {
        if (this.isOnline) {
            const { error } = await SupabaseClient.client.from('materials').delete().eq('id', id);
            if (error) console.error('Error deleting material from Supabase:', error);
        }

        let materials = await this.getMaterialsLocal();
        materials = materials.filter(m => m.id !== id);
        localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(materials));
        return materials;
    },

    // Products
    async getProducts() {
        let products = [];

        if (this.isOnline) {
            const { data, error } = await SupabaseClient.client.from('products').select('*');
            if (!error && data) {
                products = data;
                // Calculate totalCost on the client side (not stored in Supabase)
                const materials = await this.getMaterials();
                products = products.map(product => {
                    let totalCost = 0;
                    if (product.recipe && Array.isArray(product.recipe)) {
                        product.recipe.forEach(ing => {
                            const mat = materials.find(m => m.id === ing.materialId);
                            if (mat) totalCost += ing.quantity * mat.cost;
                        });
                    }
                    return { ...product, totalCost, image: product.image_url }; // Map image_url back to image for compatibility
                });
                return products;
            }
            console.error('Error fetching products from Supabase:', error);
        }

        const data = localStorage.getItem(this.KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    },

    async saveProduct(product) {
        if (this.isOnline) {
            // Only send fields that exist in Supabase schema
            const supabaseProduct = {
                id: product.id,
                name: product.name,
                category: product.category,
                image_url: product.image_url || product.image || null, // Map image to image_url
                margin: product.margin,
                price: product.price,
                recipe: product.recipe
                // Note: totalCost is not in Supabase schema, it's calculated on the fly
            };

            const { error } = await SupabaseClient.client
                .from('products')
                .upsert(supabaseProduct)
                .select();

            if (error) {
                console.error('Error saving product to Supabase:', error);
                alert('Error al guardar en la nube. Se guardará localmente.');
            }
        }

        const products = await this.getProductsLocal();
        const index = products.findIndex(p => p.id === product.id);

        if (index >= 0) {
            products[index] = product;
        } else {
            products.push(product);
        }

        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return this.isOnline ? await this.getProducts() : products;
    },

    async deleteProduct(id) {
        if (this.isOnline) {
            const { error } = await SupabaseClient.client.from('products').delete().eq('id', id);
            if (error) console.error('Error deleting product from Supabase:', error);
        }

        let products = await this.getProductsLocal();
        products = products.filter(p => p.id !== id);
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return products;
    },

    // History
    async getHistory() {
        if (this.isOnline) {
            const { data, error } = await SupabaseClient.client.from('history').select('*').order('date', { ascending: false });
            if (!error) return data;
        }
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },

    async addHistoryEntry(entry) {
        const newEntry = {
            type: 'production', // Default type
            product_name: entry.productName || entry.product_name,
            quantity: entry.quantity,
            total_cost: entry.totalCost || entry.total_cost,
            sale_price: entry.salePrice || entry.sale_price,
            profit: entry.profit,
            date: new Date().toISOString()
            // Note: productId and materialsUsed are not in Supabase schema
        };

        if (this.isOnline) {
            const { error } = await SupabaseClient.client.from('history').insert(newEntry);
            if (error) {
                console.error('Error saving history to Supabase:', error);
                alert('Error al guardar historial en la nube. Se guardará localmente.');
            }
        }

        // For localStorage, keep all fields including productId and materialsUsed
        const localEntry = {
            ...entry,
            date: new Date().toISOString()
        };

        const history = await this.getHistoryLocal();
        history.push(localEntry);
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
        return history;
    },

    async clearHistory() {
        if (this.isOnline) {
            // Warning: This deletes ALL history. In a real app we might want to be more careful.
            const { error } = await SupabaseClient.client.from('history').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
            if (error) console.error('Error clearing history in Supabase:', error);
        }
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify([]));
    },

    // Update material stock
    async updateMaterialStock(materialId, quantityUsed) {
        // We need to fetch the current stock first to ensure accuracy
        let currentStock = 0;
        let material = null;

        if (this.isOnline) {
            const { data, error } = await SupabaseClient.client.from('materials').select('*').eq('id', materialId).single();
            if (data) {
                material = data;
                currentStock = parseFloat(material.stock);
            }
        } else {
            const materials = await this.getMaterialsLocal();
            material = materials.find(m => m.id === materialId);
            if (material) currentStock = parseFloat(material.stock);
        }

        if (material) {
            const newStock = currentStock - parseFloat(quantityUsed);
            material.stock = newStock;
            await this.saveMaterial(material);
            return true;
        }
        return false;
    },

    // Price History
    async getPriceHistory() {
        if (this.isOnline) {
            const { data, error } = await SupabaseClient.client.from('price_history').select('*');
            if (!error) return data;
        }
        const data = localStorage.getItem(this.KEYS.PRICE_HISTORY);
        return data ? JSON.parse(data) : [];
    },

    async addPriceHistory(materialId, materialName, oldPrice, newPrice) {
        const entry = {
            material_id: materialId,
            material_name: materialName,
            old_price: oldPrice,
            new_price: newPrice,
            change_percent: ((newPrice - oldPrice) / oldPrice * 100).toFixed(2),
            date: new Date().toISOString()
        };

        if (this.isOnline) {
            await SupabaseClient.client.from('price_history').insert(entry);
        }

        const history = await this.getPriceHistoryLocal();
        history.push(entry);
        localStorage.setItem(this.KEYS.PRICE_HISTORY, JSON.stringify(history));
    },

    // Local Helpers (Synchronous for internal use)
    getMaterialsLocal() {
        const data = localStorage.getItem(this.KEYS.MATERIALS);
        return data ? JSON.parse(data) : [];
    },

    getProductsLocal() {
        const data = localStorage.getItem(this.KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    },

    getHistoryLocal() {
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },

    getPriceHistoryLocal() {
        const data = localStorage.getItem(this.KEYS.PRICE_HISTORY);
        return data ? JSON.parse(data) : [];
    },

    // Export/Import functions
    exportToCSV(data, filename) {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    async exportAllData() {
        const allData = {
            materials: await this.getMaterials(),
            products: await this.getProducts(),
            history: await this.getHistory(),
            priceHistory: await this.getPriceHistory(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `calculadora_costos_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
};
