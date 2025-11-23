const Storage = {
    KEYS: {
        MATERIALS: 'cost_calculator_materials',
        PRODUCTS: 'cost_calculator_products',
        HISTORY: 'cost_calculator_history',
        PRICE_HISTORY: 'cost_calculator_price_history'
    },
    getMaterials() {
        const data = localStorage.getItem(this.KEYS.MATERIALS);
        return data ? JSON.parse(data) : [];
    },
    saveMaterial(material) {
        const materials = this.getMaterials();
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
    deleteMaterial(id) {
        let materials = this.getMaterials();
        materials = materials.filter(m => m.id !== id);
        localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(materials));
        return materials;
    },
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
    getHistory() {
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },
    addHistoryEntry(entry) {
        const history = this.getHistory();
        history.unshift(entry);
        if (history.length > 100) { history.splice(100); }
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
        history.unshift({ id: Date.now(), materialId, materialName, oldPrice, newPrice, date: new Date().toISOString() });
        if (history.length > 50) { history.splice(50); }
        localStorage.setItem(this.KEYS.PRICE_HISTORY, JSON.stringify(history));
    },
    exportToCSV(data, filename) {
        if (!data || data.length === 0) { alert('No hay datos para exportar'); return; }
        const headers = Object.keys(data[0]);
        const csv = [headers.join(','), ...data.map(row => headers.map(header => { let cell = row[header]; if (typeof cell === 'object') { cell = JSON.stringify(cell); } if (cell && (cell.includes(',') || cell.includes('"'))) { cell = '"' + cell.replace(/""/g, '"""") + '"'; } return cell || ''; }).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },
    exportAllData() {
        const allData = { materials: this.getMaterials(), products: this.getProducts(), history: this.getHistory(), priceHistory: this.getPriceHistory(), exportDate: new Date().toISOString() };
        const json = JSON.stringify(allData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bonitas_creaciones_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    },
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.materials) { localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(data.materials)); }
            if (data.products) { localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(data.products)); }
            if (data.history) { localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(data.history)); }
            if (data.priceHistory) { localStorage.setItem(this.KEYS.PRICE_HISTORY, JSON.stringify(data.priceHistory)); }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};
