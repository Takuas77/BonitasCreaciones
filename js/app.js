const App = {
    state: {
        materials: [],
        products: [],
        currentRecipe: [] // Temporary state for creating/editing product
    },

    init() {
        UI.init();
        this.loadData();
        this.setupEventListeners();
    },

    loadData() {
        this.state.materials = Storage.getMaterials();
        this.state.products = Storage.getProducts();
        this.refreshUI();
    },

    refreshUI() {
        UI.renderMaterials(this.state.materials);
        UI.renderProducts(this.state.products, this.state.materials);
    },

    setupEventListeners() {
        // Material Form
        document.getElementById('btn-add-material').addEventListener('click', () => {
            document.getElementById('form-material').reset();
            document.getElementById('material-id').value = '';
            document.getElementById('modal-material-title').textContent = 'Nuevo Material';
            UI.showModal('modal-material');
        });

        document.getElementById('form-material').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveMaterial();
        });

        // Product Form
        document.getElementById('btn-add-product').addEventListener('click', () => {
            this.state.currentRecipe = [];
            document.getElementById('form-product').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-margin').value = '50'; // Default margin
            document.getElementById('modal-product-title').textContent = 'Nuevo Producto';
            // Refresh materials to ensure dropdown is up to date
            UI.renderMaterials(this.state.materials);
            UI.renderRecipeList(this.state.currentRecipe, this.state.materials);
            UI.showModal('modal-product');
        });

        document.getElementById('btn-add-ingredient').addEventListener('click', () => {
            this.handleAddIngredient();
        });

        // Update price when margin changes
        document.getElementById('product-margin').addEventListener('input', () => {
            this.updatePriceFromMargin();
        });

        // Update margin when price changes
        document.getElementById('product-price').addEventListener('input', () => {
            this.updateMarginFromPrice();
        });

        document.getElementById('form-product').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveProduct();
        });

        // Search functionality
        document.getElementById('search-materials').addEventListener('input', (e) => {
            this.filterMaterials(e.target.value);
        });

        document.getElementById('search-products').addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        // Category filters
        document.getElementById('filter-material-category').addEventListener('change', (e) => {
            this.filterMaterialsByCategory(e.target.value);
        });

        document.getElementById('filter-product-category').addEventListener('change', (e) => {
            this.filterProductsByCategory(e.target.value);
        });

        // Bulk calculator
        document.getElementById('btn-bulk-calculator').addEventListener('click', () => {
            UI.showBulkCalculator(this.state.products);
        });

        document.getElementById('btn-calculate-bulk').addEventListener('click', () => {
            this.calculateBulkOrder();
        });

        // Export buttons
        document.getElementById('btn-export-data').addEventListener('click', () => {
            UI.showModal('modal-export');
        });

        document.getElementById('btn-export-materials').addEventListener('click', () => {
            this.exportMaterials();
        });

        document.getElementById('btn-export-products').addEventListener('click', () => {
            this.exportProducts();
        });

        document.getElementById('btn-export-history').addEventListener('click', () => {
            this.exportHistory();
        });

        document.getElementById('btn-export-all').addEventListener('click', () => {
            this.exportAll();
        });

        // Reset history
        document.getElementById('btn-reset-history').addEventListener('click', () => {
            this.resetHistory();
        });
    },

    // Material Actions
    handleSaveMaterial() {
        const id = document.getElementById('material-id').value || Date.now().toString();
        const name = document.getElementById('material-name').value;
        const category = document.getElementById('material-category').value;
        const unit = document.getElementById('material-unit').value;
        const cost = parseFloat(document.getElementById('material-cost').value);
        const stock = parseFloat(document.getElementById('material-stock').value);
        const conversion = parseFloat(document.getElementById('material-conversion').value) || 1;

        const material = { id, name, category, unit, cost, stock, conversion };
        this.state.materials = Storage.saveMaterial(material);

        // Update all products that use this material
        this.updateProductCosts(id);

        UI.hideModal('modal-material');
        this.refreshUI();
    },

    updateProductCosts(materialId) {
        // Recalculate costs for all products that use this material
        let updated = false;
        this.state.products.forEach(product => {
            const usesMaterial = product.recipe.some(ing => ing.materialId === materialId);
            if (usesMaterial) {
                // Recalculate total cost
                let totalCost = 0;
                product.recipe.forEach(ing => {
                    const mat = this.state.materials.find(m => m.id === ing.materialId);
                    if (mat) totalCost += ing.quantity * mat.cost;
                });
                
                // Update product cost
                product.totalCost = totalCost;
                
                // Recalculate price based on saved margin
                if (product.margin) {
                    product.price = totalCost * (1 + product.margin / 100);
                }
                
                updated = true;
            }
        });
        
        if (updated) {
            // Save all updated products
            this.state.products.forEach(product => {
                Storage.saveProduct(product);
            });
            
            // Show notification
            this.showNotification('Costos de productos actualizados automáticamente', 'success');
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--primary-color)'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    editMaterial(id) {
        const material = this.state.materials.find(m => m.id === id);
        if (material) {
            document.getElementById('material-id').value = material.id;
            document.getElementById('material-name').value = material.name;
            document.getElementById('material-category').value = material.category || 'Otros';
            document.getElementById('material-unit').value = material.unit;
            document.getElementById('material-cost').value = material.cost;
            document.getElementById('material-stock').value = material.stock;
            document.getElementById('material-conversion').value = material.conversion || 1;

            document.getElementById('modal-material-title').textContent = 'Editar Material';
            UI.showModal('modal-material');
        }
    },

    deleteMaterial(id) {
        if (confirm('¿Estás seguro de eliminar este material?')) {
            this.state.materials = Storage.deleteMaterial(id);
            this.refreshUI();
        }
    },

    // Product Actions
    handleAddIngredient() {
        const materialId = document.getElementById('recipe-material-select').value;
        const quantity = parseFloat(document.getElementById('recipe-quantity').value);

        if (materialId && quantity > 0) {
            this.state.currentRecipe.push({ materialId, quantity });
            UI.renderRecipeList(this.state.currentRecipe, this.state.materials);
            document.getElementById('recipe-quantity').value = '';
            this.updatePriceFromMargin(); // Update price after adding ingredient
        }
    },

    removeIngredient(index) {
        this.state.currentRecipe.splice(index, 1);
        UI.renderRecipeList(this.state.currentRecipe, this.state.materials);
        this.updatePriceFromMargin(); // Update price after removing ingredient
    },

    getTotalCost() {
        let totalCost = 0;
        this.state.currentRecipe.forEach(ing => {
            const mat = this.state.materials.find(m => m.id === ing.materialId);
            if (mat) totalCost += ing.quantity * mat.cost;
        });
        return totalCost;
    },

    updatePriceFromMargin() {
        const totalCost = this.getTotalCost();
        const margin = parseFloat(document.getElementById('product-margin').value) || 0;
        
        // Calculate price: cost * (1 + margin / 100)
        const suggestedPrice = totalCost * (1 + margin / 100);
        
        // Update the price field without triggering its input event
        const priceField = document.getElementById('product-price');
        priceField.value = suggestedPrice.toFixed(2);
    },

    updateMarginFromPrice() {
        const totalCost = this.getTotalCost();
        if (totalCost === 0) return;
        
        const price = parseFloat(document.getElementById('product-price').value) || 0;
        
        // Calculate margin: ((price - cost) / cost) * 100
        const margin = ((price - totalCost) / totalCost) * 100;
        
        // Update the margin field without triggering its input event
        const marginField = document.getElementById('product-margin');
        marginField.value = margin.toFixed(1);
    },

    handleSaveProduct() {
        const id = document.getElementById('product-id').value || Date.now().toString();
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value) || 0;
        const margin = parseFloat(document.getElementById('product-margin').value) || 50;

        // Calculate total cost
        let totalCost = 0;
        this.state.currentRecipe.forEach(ing => {
            const mat = this.state.materials.find(m => m.id === ing.materialId);
            if (mat) totalCost += ing.quantity * mat.cost;
        });

        const product = {
            id,
            name,
            category,
            price,
            margin,
            recipe: this.state.currentRecipe,
            totalCost
        };

        this.state.products = Storage.saveProduct(product);
        UI.hideModal('modal-product');
        this.refreshUI();
    },

    editProduct(id) {
        const product = this.state.products.find(p => p.id === id);
        if (product) {
            this.state.currentRecipe = [...product.recipe];
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category || 'General';
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-margin').value = product.margin || 50;

            UI.renderRecipeList(this.state.currentRecipe, this.state.materials);
            document.getElementById('modal-product-title').textContent = 'Editar Producto';
            UI.showModal('modal-product');
        }
    },

    deleteProduct(id) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.state.products = Storage.deleteProduct(id);
            this.refreshUI();
        }
    },

    produceProduct(id) {
        const product = this.state.products.find(p => p.id === id);
        if (!product) return;

        // Check if we have enough stock
        let canProduce = true;
        const insufficientMaterials = [];

        product.recipe.forEach(ing => {
            const material = this.state.materials.find(m => m.id === ing.materialId);
            if (material && material.stock < ing.quantity) {
                canProduce = false;
                insufficientMaterials.push(material.name);
            }
        });

        if (!canProduce) {
            alert(`No hay suficiente stock de: ${insufficientMaterials.join(', ')}`);
            return;
        }

        // Ask for quantity and sale price
        const quantity = parseInt(prompt('¿Cuántas unidades deseas producir?', '1'));
        if (!quantity || quantity <= 0) return;

        const salePrice = parseFloat(prompt(`Precio de venta por unidad (sugerido: $${product.price || product.totalCost * 1.5})`, product.price || product.totalCost * 1.5));
        if (!salePrice || salePrice <= 0) return;

        // Deduct stock for each material
        const materialsUsed = [];
        product.recipe.forEach(ing => {
            const totalUsed = ing.quantity * quantity;
            Storage.updateMaterialStock(ing.materialId, totalUsed);
            materialsUsed.push({
                materialId: ing.materialId,
                quantity: totalUsed
            });
        });

        // Save to history
        Storage.addHistoryEntry({
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            totalCost: product.totalCost * quantity,
            salePrice: salePrice * quantity,
            profit: (salePrice - product.totalCost) * quantity,
            materialsUsed: materialsUsed
        });

        this.loadData();
        alert(`¡Producción registrada! ${quantity} unidad(es) de ${product.name}`);
    },

    filterMaterials(query) {
        const filtered = this.state.materials.filter(m => 
            m.name.toLowerCase().includes(query.toLowerCase())
        );
        UI.renderMaterials(filtered);
    },

    filterProducts(query) {
        const filtered = this.state.products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        UI.renderProducts(filtered, this.state.materials);
    },

    filterMaterialsByCategory(category) {
        if (category === 'all') {
            UI.renderMaterials(this.state.materials);
        } else {
            const filtered = this.state.materials.filter(m => m.category === category);
            UI.renderMaterials(filtered);
        }
    },

    filterProductsByCategory(category) {
        if (category === 'all') {
            UI.renderProducts(this.state.products, this.state.materials);
        } else {
            const filtered = this.state.products.filter(p => p.category === category);
            UI.renderProducts(filtered, this.state.materials);
        }
    },

    calculateBulkOrder() {
        const productId = document.getElementById('bulk-product').value;
        const quantity = parseInt(document.getElementById('bulk-quantity').value) || 0;

        if (!productId || quantity <= 0) {
            alert('Selecciona un producto y cantidad válida');
            return;
        }

        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        let resultsHTML = '<h3>Materiales necesarios para ' + quantity + ' unidades de ' + product.name + '</h3>';
        resultsHTML += '<table class="bulk-results-table"><thead><tr><th>Material</th><th>Necesario</th><th>Disponible</th><th>Faltante</th></tr></thead><tbody>';

        let canProduce = true;
        product.recipe.forEach(ing => {
            const material = this.state.materials.find(m => m.id === ing.materialId);
            if (material) {
                const needed = ing.quantity * quantity;
                const available = material.stock;
                const missing = Math.max(0, needed - available);
                
                if (missing > 0) canProduce = false;

                resultsHTML += '<tr>';
                resultsHTML += '<td>' + material.name + '</td>';
                resultsHTML += '<td>' + needed.toFixed(2) + ' ' + material.unit + '</td>';
                resultsHTML += '<td>' + available.toFixed(2) + ' ' + material.unit + '</td>';
                resultsHTML += '<td class="' + (missing > 0 ? 'text-danger' : 'text-success') + '">' + missing.toFixed(2) + ' ' + material.unit + '</td>';
                resultsHTML += '</tr>';
            }
        });

        resultsHTML += '</tbody></table>';
        resultsHTML += '<div class="bulk-summary">';
        resultsHTML += '<p><strong>Costo total:</strong> $' + (product.totalCost * quantity).toFixed(2) + '</p>';
        resultsHTML += '<p><strong>Precio de venta:</strong> $' + (product.price * quantity).toFixed(2) + '</p>';
        resultsHTML += '<p><strong>Ganancia:</strong> $' + ((product.price - product.totalCost) * quantity).toFixed(2) + '</p>';
        resultsHTML += '<p class="' + (canProduce ? 'text-success' : 'text-danger') + '"><strong>' + (canProduce ? '✓ Puedes producir este pedido' : '✗ No hay suficiente stock') + '</strong></p>';
        resultsHTML += '</div>';

        document.getElementById('bulk-results').innerHTML = resultsHTML;
    },

    exportMaterials() {
        Storage.exportToCSV(this.state.materials, 'materiales');
        this.showNotification('Materiales exportados', 'success');
    },

    exportProducts() {
        Storage.exportToCSV(this.state.products, 'productos');
        this.showNotification('Productos exportados', 'success');
    },

    exportHistory() {
        const history = Storage.getHistory();
        Storage.exportToCSV(history, 'historial');
        this.showNotification('Historial exportado', 'success');
    },

    exportAll() {
        Storage.exportAllData();
        this.showNotification('Datos completos exportados', 'success');
    },

    resetHistory() {
        if (confirm('¿Estás seguro de reiniciar el historial? Esta acción no se puede deshacer.')) {
            Storage.clearHistory();
            this.loadData();
            this.showNotification('Historial reiniciado', 'info');
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    window.App = App; // Expose to window for onclick handlers
    App.init();
});
