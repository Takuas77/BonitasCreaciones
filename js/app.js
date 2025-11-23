const App = {
    initialized: false, // Bandera para evitar inicialización múltiple
    
    state: {
        materials: [],
        products: [],
        history: [], // Added history to state
        currentRecipe: [], // Temporary state for creating/editing product
        currentProductImage: '', // Temporary state for product image
        currentProductImageFile: null, // Archivo de imagen temporal para productos
        currentProductImagePath: '', // Ruta de la imagen en Storage para eliminar si se reemplaza
        currentMaterialImage: '', // Temporary state for material image
        currentMaterialImageFile: null, // Archivo de imagen temporal para materiales
        currentMaterialImagePath: '' // Ruta de la imagen en Storage para eliminar si se reemplaza
    },

    async init() {
        // Evitar inicialización múltiple
        if (this.initialized) {
            await this.loadData();
            return;
        }
        
        UI.init();
        await this.loadData();
        this.setupEventListeners();
        this.setupSettingsListeners();
        this.initialized = true;
    },

    async loadData() {
        try {
            this.state.materials = await Storage.getMaterials();
            this.state.products = await Storage.getProducts();
            this.state.history = await Storage.getHistory();
            this.refreshUI();
        } catch (error) {
            this.showNotification("Error al cargar datos", "error");
        }
    },

    refreshUI() {
        UI.renderMaterials(this.state.materials, this.state.history); // Pass history
        UI.renderProducts(this.state.products, this.state.materials);
    },

    setupEventListeners() {
        // Material Form
        document.getElementById('btn-add-material').addEventListener('click', () => {
            document.getElementById('form-material').reset();
            document.getElementById('material-id').value = '';
            document.getElementById('modal-material-title').textContent = 'Nuevo Material';
            // Limpiar estado de imagen al crear nuevo material
            this.removeMaterialImage();
            this.state.currentMaterialImage = '';
            this.state.currentMaterialImageFile = null;
            this.state.currentMaterialImagePath = '';
            UI.showModal('modal-material');
        });

        document.getElementById('form-material').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Prevenir doble submit
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Guardando...';
            
            try {
                await this.handleSaveMaterial();
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Guardar Material';
            }
        });

        // Product Form
        document.getElementById('btn-add-product').addEventListener('click', () => {
            this.state.currentRecipe = [];
            document.getElementById('form-product').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-margin').value = '50'; // Default margin
            document.getElementById('modal-product-title').textContent = 'Nuevo Producto';
            // Limpiar estado de imagen al crear nuevo producto
            this.removeProductImage();
            this.state.currentProductImage = '';
            this.state.currentProductImageFile = null;
            this.state.currentProductImagePath = '';
            // Refresh materials to ensure dropdown is up to date
            UI.renderMaterials(this.state.materials, this.state.history);
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

        document.getElementById('form-product').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Prevenir doble submit
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Guardando...';
            
            try {
                await this.handleSaveProduct();
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Guardar Producto';
            }
        });

        // Image preview
        document.getElementById('product-image').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'product');
        });

        document.getElementById('btn-remove-image').addEventListener('click', () => {
            this.removeProductImage();
        });

        // Material Image preview
        const materialImageInput = document.getElementById('material-image');
        if (materialImageInput) {
            materialImageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e, 'material');
            });
        }

        const btnRemoveMaterialImage = document.getElementById('btn-remove-material-image');
        if (btnRemoveMaterialImage) {
            btnRemoveMaterialImage.addEventListener('click', () => {
                this.removeMaterialImage();
            });
        }

        // Gallery
        document.getElementById('btn-view-gallery').addEventListener('click', () => {
            UI.showGallery(this.state.products);
        });

        document.getElementById('btn-share-catalog').addEventListener('click', () => {
            this.shareCatalog();
        });

        document.getElementById('btn-print-catalog').addEventListener('click', () => {
            this.printCatalog();
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

        document.getElementById('btn-export-history').addEventListener('click', async () => {
            await this.exportHistory();
        });

        document.getElementById('btn-export-all').addEventListener('click', async () => {
            await this.exportAll();
        });

        // Reset history
        document.getElementById('btn-reset-history').addEventListener('click', async () => {
            await this.resetHistory();
        });
    },

    setupSettingsListeners() {
        const btnOpenSettings = document.getElementById('btn-open-settings');
        if (btnOpenSettings) {
            btnOpenSettings.addEventListener('click', () => {
                const urlInput = document.getElementById('supabase-url');
                const keyInput = document.getElementById('supabase-key');
                if (urlInput) urlInput.value = localStorage.getItem('supabase_url') || '';
                if (keyInput) keyInput.value = localStorage.getItem('supabase_key') || '';
                UI.showModal('modal-settings');
            });
        }

        const formSettings = document.getElementById('form-settings');
        if (formSettings) {
            formSettings.addEventListener('submit', (e) => {
                e.preventDefault();
                const url = document.getElementById('supabase-url').value;
                const key = document.getElementById('supabase-key').value;
                if (typeof SupabaseClient !== 'undefined') {
                    SupabaseClient.saveCredentials(url, key);
                }
            });
        }

        const btnDisconnect = document.getElementById('btn-disconnect');
        if (btnDisconnect) {
            btnDisconnect.addEventListener('click', () => {
                if (confirm('¿Desconectar de Supabase? Volverás a usar el almacenamiento local.')) {
                    if (typeof SupabaseClient !== 'undefined') {
                        SupabaseClient.clearCredentials();
                    }
                }
            });
        }
    },

    // Material Actions
    async handleSaveMaterial() {
        const id = document.getElementById('material-id').value || crypto.randomUUID();
        const name = document.getElementById('material-name').value.trim();
        const category = document.getElementById('material-category').value;
        const unit = document.getElementById('material-unit').value;
        const cost = parseFloat(document.getElementById('material-cost').value);
        const stock = parseFloat(document.getElementById('material-stock').value);
        const conversion = parseFloat(document.getElementById('material-conversion').value) || 1;

        let imageUrl = this.state.currentMaterialImage || '';
        let imagePath = this.state.currentMaterialImagePath || '';

        // Validación #5: Valores negativos
        if (cost < 0 || stock < 0 || conversion < 0) {
            alert('❌ Los valores no pueden ser negativos.\n\nPor favor ingresa valores válidos.');
            return;
        }

        // Validación #4: Nombres duplicados
        const duplicateName = this.state.materials.some(m =>
            m.name.toLowerCase() === name.toLowerCase() && m.id !== id
        );
        if (duplicateName) {
            alert(`❌ Ya existe un material con el nombre "${name}".\n\nPor favor usa un nombre diferente.`);
            return;
        }

        // Si hay un archivo de imagen nuevo, subirlo a Supabase Storage
        if (this.state.currentMaterialImageFile && Auth.currentUser) {
            const uploadResult = await SupabaseStorage.uploadImage(
                this.state.currentMaterialImageFile,
                'materials',
                Auth.currentUser.id
            );

            if (uploadResult) {
                // Si se subió exitosamente, eliminar la imagen anterior si existe
                if (imagePath) {
                    await SupabaseStorage.deleteImage(imagePath);
                }
                imageUrl = uploadResult.url;
                imagePath = uploadResult.path;
            } else {
                // Si falla la subida a Supabase, usar Base64 como fallback
                if (this.state.currentMaterialImageFile) {
                    imageUrl = await SupabaseStorage.fileToBase64(this.state.currentMaterialImageFile);
                    imagePath = ''; // No hay path en Storage
                }
            }
        }

        const material = { 
            id, 
            name, 
            category, 
            unit, 
            cost, 
            stock, 
            conversion_factor: conversion,
            image_url: imageUrl,
            image_path: imagePath
        };

        try {
            this.state.materials = await Storage.saveMaterial(material);
            await this.updateProductCosts(id);
            // Limpiar estado temporal
            this.state.currentMaterialImage = '';
            this.state.currentMaterialImageFile = null;
            this.state.currentMaterialImagePath = '';
            UI.hideModal('modal-material');
            this.refreshUI();
            this.showNotification('Material guardado correctamente', 'success');
        } catch (e) {
            this.showNotification('Error al guardar material', 'error');
        }
    },

    async updateProductCosts(materialId) {
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
            for (const product of this.state.products) {
                await Storage.saveProduct(product);
            }

            // Show notification
            this.showNotification('Costos de productos actualizados automáticamente', 'success');
        }
    },

    showNotification(message, type = 'info') {
        // Crear contenedor de notificaciones si no existe
        let container = document.getElementById('notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : 'var(--primary-color)')};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            pointer-events: auto;
            max-width: 350px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
                // Limpiar contenedor si está vacío
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
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
            document.getElementById('material-conversion').value = material.conversion_factor || 1;

            // Load image if exists
            const imgUrl = material.image_url || '';
            const imgPath = material.image_path || '';
            
            if (imgUrl) {
                this.state.currentMaterialImage = imgUrl;
                this.state.currentMaterialImagePath = imgPath;
                this.state.currentMaterialImageFile = null;
                const previewImg = document.getElementById('material-preview-img');
                const imagePreview = document.getElementById('material-image-preview');
                if (previewImg && imagePreview) {
                    previewImg.src = imgUrl;
                    imagePreview.style.display = 'block';
                }
            } else {
                this.removeMaterialImage();
            }

            document.getElementById('modal-material-title').textContent = 'Editar Material';
            UI.showModal('modal-material');
        }
    },

    async deleteMaterial(id) {
        // Check if material is being used in any product
        const productsUsingMaterial = this.state.products.filter(product =>
            product.recipe && product.recipe.some(ing => ing.materialId === id)
        );

        if (productsUsingMaterial.length > 0) {
            const productNames = productsUsingMaterial.map(p => p.name).join(', ');
            alert(`❌ No se puede eliminar este material.\n\nEstá siendo usado en los siguientes productos:\n• ${productNames}\n\nPrimero debes eliminar o editar estos productos.`);
            return;
        }

        if (confirm('¿Estás seguro de eliminar este material?')) {
            this.state.materials = await Storage.deleteMaterial(id);
            this.refreshUI();
            this.showNotification('Material eliminado correctamente', 'success');
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

    async handleSaveProduct() {
        const id = document.getElementById('product-id').value || crypto.randomUUID();
        const name = document.getElementById('product-name').value.trim();
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value) || 0;
        const margin = parseFloat(document.getElementById('product-margin').value) || 50;
        
        let imageUrl = this.state.currentProductImage || '';
        let imagePath = this.state.currentProductImagePath || '';

        // Validación 3: Producto sin materiales
        if (this.state.currentRecipe.length === 0) {
            alert('❌ No puedes crear un producto sin materiales.\n\nAgrega al menos un material a la receta.');
            return;
        }

        // Validación 4: Nombres duplicados
        const duplicateName = this.state.products.some(p =>
            p.name.toLowerCase() === name.toLowerCase() && p.id !== id
        );
        if (duplicateName) {
            alert(`❌ Ya existe un producto con el nombre "${name}".\n\nPor favor usa un nombre diferente.`);
            return;
        }

        // Calculate total cost
        let totalCost = 0;
        this.state.currentRecipe.forEach(ing => {
            const mat = this.state.materials.find(m => m.id === ing.materialId);
            if (mat) totalCost += ing.quantity * mat.cost;
        });

        // Validación 2: Precio menor al costo
        if (price < totalCost && price > 0) {
            const shouldContinue = confirm(
                `⚠️ ADVERTENCIA: Precio de venta menor al costo\n\n` +
                `Costo: $${totalCost.toFixed(2)}\n` +
                `Precio: $${price.toFixed(2)}\n` +
                `Pérdida: $${(totalCost - price).toFixed(2)}\n\n` +
                `¿Estás seguro de continuar? Tendrás pérdidas en cada venta.`
            );
            if (!shouldContinue) return;
        }

        // Si hay un archivo de imagen nuevo, subirlo a Supabase Storage
        if (this.state.currentProductImageFile && Auth.currentUser) {
            const uploadResult = await SupabaseStorage.uploadImage(
                this.state.currentProductImageFile,
                'products',
                Auth.currentUser.id
            );

            if (uploadResult) {
                // Si se subió exitosamente, eliminar la imagen anterior si existe
                if (imagePath) {
                    await SupabaseStorage.deleteImage(imagePath);
                }
                imageUrl = uploadResult.url;
                imagePath = uploadResult.path;
            } else {
                // Si falla la subida a Supabase, usar Base64 como fallback
                if (this.state.currentProductImageFile) {
                    imageUrl = await SupabaseStorage.fileToBase64(this.state.currentProductImageFile);
                    imagePath = ''; // No hay path en Storage
                }
            }
        }

        const product = {
            id,
            name,
            category,
            price,
            margin,
            recipe: this.state.currentRecipe,
            totalCost,
            image_url: imageUrl,
            image_path: imagePath // Guardar path para poder eliminar después
        };
        
        // Para compatibilidad local, mantener también 'image'
        product.image = imageUrl;

        try {
            this.state.products = await Storage.saveProduct(product);
            // Limpiar estado temporal
            this.state.currentProductImage = '';
            this.state.currentProductImageFile = null;
            this.state.currentProductImagePath = '';
            UI.hideModal('modal-product');
            this.refreshUI();
            this.showNotification('Producto guardado correctamente', 'success');
        } catch (e) {
            this.showNotification('Error al guardar producto', 'error');
        }
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

            // Load image if exists
            const imgUrl = product.image || product.image_url;
            const imgPath = product.image_path || '';
            
            if (imgUrl) {
                this.state.currentProductImage = imgUrl;
                this.state.currentProductImagePath = imgPath;
                this.state.currentProductImageFile = null; // No hay archivo nuevo al editar
                document.getElementById('preview-img').src = imgUrl;
                document.getElementById('image-preview').style.display = 'block';
            } else {
                this.removeProductImage();
            }

            UI.renderRecipeList(this.state.currentRecipe, this.state.materials);
            document.getElementById('modal-product-title').textContent = 'Editar Producto';
            UI.showModal('modal-product');
        }
    },

    async deleteProduct(id) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.state.products = await Storage.deleteProduct(id);
            this.refreshUI();
        }
    },

    async produceProduct(id) {
        const product = this.state.products.find(p => p.id === id);
        if (!product) return;

        // Ask for quantity first
        const quantity = parseInt(prompt('¿Cuántas unidades deseas producir?', '1'));
        if (!quantity || quantity <= 0) return;

        // Validación 1: Stock insuficiente para la cantidad total
        let canProduce = true;
        const insufficientMaterials = [];
        const stockDetails = [];

        product.recipe.forEach(ing => {
            const material = this.state.materials.find(m => m.id === ing.materialId);
            if (material) {
                const needed = ing.quantity * quantity;
                const available = material.stock;
                const missing = needed - available;

                if (available < needed) {
                    canProduce = false;
                    insufficientMaterials.push(material.name);
                    stockDetails.push(
                        `• ${material.name}: Necesitas ${needed.toFixed(2)} ${material.unit}, ` +
                        `tienes ${available.toFixed(2)} ${material.unit} ` +
                        `(faltan ${missing.toFixed(2)} ${material.unit})`
                    );
                }
            }
        });

        if (!canProduce) {
            alert(
                `❌ Stock insuficiente para producir ${quantity} unidad(es)\n\n` +
                stockDetails.join('\n') +
                `\n\nPor favor compra más materiales o reduce la cantidad.`
            );
            return;
        }

        const salePrice = parseFloat(prompt(`Precio de venta por unidad (sugerido: $${product.price || product.totalCost * 1.5})`, product.price || product.totalCost * 1.5));
        if (!salePrice || salePrice <= 0) return;

        // Validación 2: Advertencia si vende a pérdida
        if (salePrice < product.totalCost) {
            const shouldContinue = confirm(
                `⚠️ ADVERTENCIA: Venta a pérdida\n\n` +
                `Costo unitario: $${product.totalCost.toFixed(2)}\n` +
                `Precio de venta: $${salePrice.toFixed(2)}\n` +
                `Pérdida por unidad: $${(product.totalCost - salePrice).toFixed(2)}\n` +
                `Pérdida total: $${((product.totalCost - salePrice) * quantity).toFixed(2)}\n\n` +
                `¿Estás seguro de continuar?`
            );
            if (!shouldContinue) return;
        }

        // Deduct stock for each material
        const materialsUsed = [];
        for (const ing of product.recipe) {
            const totalUsed = ing.quantity * quantity;
            await Storage.updateMaterialStock(ing.materialId, totalUsed);
            materialsUsed.push({
                materialId: ing.materialId,
                quantity: totalUsed
            });
        }

        // Save to history
        await Storage.addHistoryEntry({
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            totalCost: product.totalCost * quantity,
            salePrice: salePrice * quantity,
            profit: (salePrice - product.totalCost) * quantity,
            materialsUsed: materialsUsed
        });

        await this.loadData();
        this.showNotification(`¡Producción registrada! ${quantity} unidad(es) de ${product.name}`, 'success');
    },

    filterMaterials(query) {
        const filtered = this.state.materials.filter(m =>
            m.name.toLowerCase().includes(query.toLowerCase())
        );
        UI.renderMaterials(filtered, this.state.history);
    },

    filterProducts(query) {
        const filtered = this.state.products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        UI.renderProducts(filtered, this.state.materials);
    },

    filterMaterialsByCategory(category) {
        if (category === 'all') {
            UI.renderMaterials(this.state.materials, this.state.history);
        } else {
            const filtered = this.state.materials.filter(m => m.category === category);
            UI.renderMaterials(filtered, this.state.history);
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

    async exportHistory() {
        const history = await Storage.getHistory();
        Storage.exportToCSV(history, 'historial');
        this.showNotification('Historial exportado', 'success');
    },

    async exportAll() {
        await Storage.exportAllData();
        this.showNotification('Datos completos exportados', 'success');
    },

    async resetHistory() {
        if (confirm('¿Estás seguro de reiniciar el historial? Esta acción no se puede deshacer.')) {
            await Storage.clearHistory();
            await this.loadData();
            this.showNotification('Historial reiniciado', 'info');
        }
    },

    handleImageUpload(e, type = 'product') {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es muy grande. Tamaño máximo: 2MB');
            e.target.value = '';
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            e.target.value = '';
            return;
        }

        if (type === 'product') {
            // Guardar el archivo para subir después
            this.state.currentProductImageFile = file;

            // Mostrar preview
            const reader = new FileReader();
            reader.onload = (event) => {
                this.state.currentProductImage = event.target.result;
                document.getElementById('preview-img').src = event.target.result;
                document.getElementById('image-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else if (type === 'material') {
            // Guardar el archivo para subir después
            this.state.currentMaterialImageFile = file;

            // Mostrar preview
            const reader = new FileReader();
            reader.onload = (event) => {
                this.state.currentMaterialImage = event.target.result;
                const previewImg = document.getElementById('material-preview-img');
                const imagePreview = document.getElementById('material-image-preview');
                if (previewImg && imagePreview) {
                    previewImg.src = event.target.result;
                    imagePreview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    },

    removeProductImage() {
        this.state.currentProductImage = '';
        this.state.currentProductImageFile = null;
        // No eliminamos currentProductImagePath aquí porque se necesita para eliminar en Storage
        document.getElementById('product-image').value = '';
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('preview-img').src = '';
    },

    removeMaterialImage() {
        this.state.currentMaterialImage = '';
        this.state.currentMaterialImageFile = null;
        // No eliminamos currentMaterialImagePath aquí porque se necesita para eliminar en Storage
        const materialImageInput = document.getElementById('material-image');
        const previewImg = document.getElementById('material-preview-img');
        const imagePreview = document.getElementById('material-image-preview');
        
        if (materialImageInput) materialImageInput.value = '';
        if (imagePreview) imagePreview.style.display = 'none';
        if (previewImg) previewImg.src = '';
    },

    shareCatalog() {
        const products = this.state.products.filter(p => p.image || p.image_url);
        if (products.length === 0) {
            alert('No hay productos con imágenes para compartir');
            return;
        }

        // Generate catalog HTML
        let catalogHTML = '<html><head><meta charset="UTF-8"><title>Catálogo - Bonitas Creaciones</title>';
        catalogHTML += '<style>body{font-family:Arial,sans-serif;max-width:1200px;margin:0 auto;padding:20px;background:#f5f5f5}';
        catalogHTML += 'h1{text-align:center;color:#6366f1;margin-bottom:30px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}';
        catalogHTML += '.card{background:white;border-radius:12px;padding:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}';
        catalogHTML += '.card img{width:100%;height:250px;object-fit:cover;border-radius:8px;margin-bottom:10px}';
        catalogHTML += '.card h3{margin:10px 0;color:#333}.card p{margin:5px 0;color:#666}.price{font-size:1.5rem;color:#10b981;font-weight:bold}</style></head><body>';
        catalogHTML += '<h1>📸 Catálogo de Productos - Bonitas Creaciones</h1><div class="grid">';

        products.forEach(p => {
            const img = p.image || p.image_url;
            catalogHTML += '<div class="card">';
            catalogHTML += '<img src="' + img + '" alt="' + p.name + '">';
            catalogHTML += '<h3>' + p.name + '</h3>';
            catalogHTML += '<p>Categoría: ' + (p.category || 'General') + '</p>';
            catalogHTML += '<p class="price">$' + p.price.toFixed(2) + '</p>';
            catalogHTML += '</div>';
        });

        catalogHTML += '</div></body></html>';

        // Open in new window
        const win = window.open('', '_blank');
        win.document.write(catalogHTML);
        win.document.close();
    },

    printCatalog() {
        const products = this.state.products.filter(p => p.image || p.image_url);
        if (products.length === 0) {
            alert('No hay productos con imágenes para imprimir');
            return;
        }
        this.shareCatalog();
        setTimeout(() => {
            window.print();
        }, 500);
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    window.App = App; // Expose to window for onclick handlers
    // App.init() is called by Auth.showApp() after successful login
    // No need to call it here - Auth handles initialization
});
