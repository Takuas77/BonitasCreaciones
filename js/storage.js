const Storage = {
    KEYS: {
        MATERIALS: 'cost_calculator_materials',
        PRODUCTS: 'cost_calculator_products',
        HISTORY: 'cost_calculator_history',
        PRICE_HISTORY: 'cost_calculator_price_history'
    },

    // Materials
    getMaterials() {
        const data = localStorage.getItem(this.KEYS.MATERIALS);
        return data ? JSON.parse(data) : [];
    },

    saveMaterial(material) {
        const materials = this.getMaterials();
        const index = materials.findIndex(m => m.id === material.id);

        // Track price history if material exists and price changed
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

    deleteMaterial(id) {
        let materials = this.getMaterials();
        materials = materials.filter(m => m.id !== id);
        localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(materials));
        return materials;
    },

    // Products
    getProducts() {
        const data = localStorage.getItem(this.KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    },

    saveProduct(product) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === product.id);

        if (index >= 0) {
            products[index] = product;
        } else {
            products.push(product);
        }

        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return products;
    },

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return products;
    },

    // History
    getHistory() {
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },

    addHistoryEntry(entry) {
        const history = this.getHistory();
        history.push({
            ...entry,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
        return history;
    },

    clearHistory() {
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify([]));
    },

    // Update material stock
    updateMaterialStock(materialId, quantityUsed) {
        const materials = this.getMaterials();
        const material = materials.find(m => m.id === materialId);

        if (material) {
            material.stock = parseFloat(material.stock) - parseFloat(quantityUsed);
            this.saveMaterial(material);
            return true;
        }
        return false;
    },

    // Price History
    getPriceHistory() {
        const data = localStorage.getItem(this.KEYS.PRICE_HISTORY);
        return data ? JSON.parse(data) : [];
    },

    addPriceHistory(materialId, materialName, oldPrice, newPrice) {
        const history = this.getPriceHistory();
        history.push({
            materialId,
            materialName,
            oldPrice,
            newPrice,
            change: ((newPrice - oldPrice) / oldPrice * 100).toFixed(2),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.KEYS.PRICE_HISTORY, JSON.stringify(history));
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

    exportAllData() {
        const allData = {
            materials: this.getMaterials(),
            products: this.getProducts(),
            history: this.getHistory(),
            priceHistory: this.getPriceHistory(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `calculadora_costos_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
};
