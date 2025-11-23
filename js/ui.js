const UI = {
    initialized: false, // Bandera para evitar inicialización múltiple
    
    elements: {
        materialsList: document.getElementById('materials-list'),
        productsList: document.getElementById('products-list'),
        recipeList: document.getElementById('recipe-list'),
        recipeSelect: document.getElementById('recipe-material-select'),
        totalProductsCount: document.getElementById('total-products-count'),
        totalSales: document.getElementById('total-sales'),
        totalCosts: document.getElementById('total-costs'),
        totalProfit: document.getElementById('total-profit'),
        lowStockCount: document.getElementById('low-stock-count'),
        lowStockAlert: document.getElementById('low-stock-alert'),
        lowStockList: document.getElementById('low-stock-list'),
        topConsumedList: document.getElementById('top-consumed-list'),
        modals: {
            material: document.getElementById('modal-material'),
            product: document.getElementById('modal-product')
        }
    },

    init() {
        if (this.initialized) {
            return;
        }
        
        this.setupNavigation();
        this.setupModals();
        this.setupListDelegation();
        this.initialized = true;
    },

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const views = document.querySelectorAll('.view');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Ignorar si no tiene data-target (ej: botón logout)
                if (!btn.dataset.target) return;
                
                navBtns.forEach(b => b.classList.remove('active'));
                views.forEach(v => {
                    v.classList.remove('active');
                    v.classList.add('hidden');
                });
                btn.classList.add('active');
                const targetView = document.getElementById(btn.dataset.target);
                if (targetView) {
                    targetView.classList.remove('hidden');
                    targetView.classList.add('active');
                }
            });
        });
    },

    setupModals() {
        const closeBtns = document.querySelectorAll('.close-modal');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Buscar el modal padre y ocultarlo
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('visible');
                    setTimeout(() => modal.classList.add('hidden'), 300);
                }
            });
        });
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('visible');
                setTimeout(() => e.target.classList.add('hidden'), 300);
            }
        });
    },

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('visible'), 10);
        }
    },

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    },

    setupListDelegation() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.classList.contains('edit-btn') && btn.closest('#materials-list')) {
                App.editMaterial(id);
            } else if (btn.classList.contains('delete-btn') && btn.closest('#materials-list')) {
                App.deleteMaterial(id);
            } else if (btn.classList.contains('produce-btn')) {
                App.produceProduct(id);
            } else if (btn.classList.contains('edit-btn') && btn.closest('#products-list')) {
                App.editProduct(id);
            } else if (btn.classList.contains('delete-btn') && btn.closest('#products-list')) {
                App.deleteProduct(id);
            }
        });
    },

    renderProducts(products, materials) {
        this.elements.productsList.innerHTML = '';
        this.elements.totalProductsCount.textContent = products.length;
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const cost = parseFloat(product.totalCost).toFixed(2);
            const hasPrice = product.price && product.price > 0;
            const price = hasPrice ? '$' + parseFloat(product.price).toFixed(2) : 'N/A';
            const profit = hasPrice ? (product.price - product.totalCost).toFixed(2) : 0;
            const actualMargin = hasPrice ? (((product.price - product.totalCost) / product.totalCost) * 100).toFixed(1) : 0;
            const desiredMargin = product.margin || 'N/A';
            const category = product.category || 'General';

            // Add image if exists - priorizar image_url de Supabase Storage
            const imgUrl = product.image_url || product.image;
            if (imgUrl) {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'product-image';
                imgDiv.innerHTML = '<img src="' + imgUrl + '" alt="' + product.name + '" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">';
                card.appendChild(imgDiv);
            }

            const header = document.createElement('div');
            header.className = 'product-header';
            header.innerHTML = '<div><span class="product-title">' + product.name + '</span><span class="category-badge" style="font-size: 0.75rem; margin-left: 8px;">' + category + '</span></div><span class="product-cost">Costo: $' + cost + '</span>';

            const priceDiv = document.createElement('div');
            priceDiv.className = 'product-price';
            priceDiv.textContent = price;

            const marginDiv = document.createElement('div');
            marginDiv.style.cssText = 'font-size: 0.85rem; color: var(--text-muted); margin: 8px 0;';
            marginDiv.innerHTML = '<div>Ganancia: <strong style="color: var(--success);">$' + profit + '</strong></div>' +
                '<div>Margen real: <strong>' + actualMargin + '%</strong> | Configurado: <strong>' + desiredMargin + '%</strong></div>';

            const actions = document.createElement('div');
            actions.className = 'product-actions';
            actions.innerHTML = '<button class="action-btn primary produce-btn" data-id="' + product.id + '">Producir</button><button class="action-btn secondary edit-btn" data-id="' + product.id + '">Editar</button><button class="action-btn danger delete-btn" data-id="' + product.id + '">Eliminar</button>';
            card.appendChild(header);
            card.appendChild(priceDiv);
            card.appendChild(marginDiv);
            card.appendChild(actions);
            this.elements.productsList.appendChild(card);
        });
    },

    renderDashboardMetrics(materials, history = []) {
        // If history is not passed, try to get it from storage (fallback, though deprecated in new flow)
        if (!history || history.length === 0) {
            // In async flow, we expect history to be passed. If not, we show 0.
            // We avoid calling Storage.getHistory() here to prevent async issues in sync render.
        }

        let sales = 0;
        let costs = 0;
        const consumptionMap = {};
        history.forEach(entry => {
            sales += entry.salePrice || 0;
            costs += entry.totalCost || 0;
            if (entry.materialsUsed) {
                entry.materialsUsed.forEach(m => {
                    consumptionMap[m.materialId] = (consumptionMap[m.materialId] || 0) + m.quantity;
                });
            }
        });
        const profit = sales - costs;
        if (this.elements.totalSales) this.elements.totalSales.textContent = '$' + sales.toFixed(2);
        if (this.elements.totalCosts) this.elements.totalCosts.textContent = '$' + costs.toFixed(2);
        if (this.elements.totalProfit) {
            this.elements.totalProfit.textContent = '$' + profit.toFixed(2);
            this.elements.totalProfit.className = profit >= 0 ? 'stat-value success' : 'stat-value warning';
        }
        if (this.elements.topConsumedList) {
            this.elements.topConsumedList.innerHTML = '';
            const sortedConsumption = Object.entries(consumptionMap).sort(([, a], [, b]) => b - a).slice(0, 5);
            sortedConsumption.forEach(([id, qty]) => {
                const material = materials.find(m => m.id === id);
                if (material) {
                    const li = document.createElement('li');
                    li.className = 'stock-item';
                    li.innerHTML = '<span>' + material.name + '</span><span class="stock-value">' + qty.toFixed(2) + ' ' + material.unit + '</span>';
                    this.elements.topConsumedList.appendChild(li);
                }
            });
            if (sortedConsumption.length === 0) {
                this.elements.topConsumedList.innerHTML = '<li class="stock-item" style="color: var(--text-muted); justify-content: center;">Sin datos aún</li>';
            }
        }
    },

    renderMaterials(materials, history = []) {
        this.renderDashboardMetrics(materials, history);
        this.elements.materialsList.innerHTML = '';
        this.elements.recipeSelect.innerHTML = '<option value="">Seleccionar Material...</option>';
        if (this.elements.lowStockList) this.elements.lowStockList.innerHTML = '';
        let lowStock = 0;
        materials.forEach(material => {
            const row = document.createElement('tr');
            const stockBadge = material.stock < 5 ? 'low' : 'ok';
            const categoryBadge = material.category || 'Otros';
            
            // Construir HTML con imagen si existe
            let materialNameHtml = material.name;
            const imgUrl = material.image_url || material.image;
            if (imgUrl) {
                materialNameHtml = `<div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${imgUrl}" alt="${material.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                    <span>${material.name}</span>
                </div>`;
            }
            
            row.innerHTML = '<td>' + materialNameHtml + '</td><td><span class="category-badge">' + categoryBadge + '</span></td><td>' + material.unit + '</td><td>$' + parseFloat(material.cost).toFixed(2) + '</td><td><span class="stock-badge ' + stockBadge + '">' + parseFloat(material.stock).toFixed(2) + '</span></td><td><button class="action-btn secondary edit-btn" data-id="' + material.id + '">✏️</button><button class="action-btn danger delete-btn" data-id="' + material.id + '">🗑️</button></td>';
            this.elements.materialsList.appendChild(row);
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = material.name + ' ($' + material.cost + '/' + material.unit + ')';
            this.elements.recipeSelect.appendChild(option);
            if (material.stock < 5) {
                lowStock++;
                if (this.elements.lowStockList) {
                    const li = document.createElement('li');
                    li.className = 'stock-item low';
                    li.innerHTML = '<span>' + material.name + '</span><span class="stock-value">' + parseFloat(material.stock).toFixed(2) + ' ' + material.unit + '</span>';
                    this.elements.lowStockList.appendChild(li);
                }
            }
        });
        this.elements.lowStockCount.textContent = lowStock;
        if (lowStock > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = 'background: rgba(245, 158, 11, 0.2); color: var(--warning); padding: 10px; border-radius: 8px; margin-bottom: 10px;';
            alertDiv.textContent = '⚠️ Tienes ' + lowStock + ' materiales con stock bajo.';
            this.elements.lowStockAlert.innerHTML = '';
            this.elements.lowStockAlert.appendChild(alertDiv);
        } else {
            this.elements.lowStockAlert.innerHTML = '';
        }
    },

    renderRecipeList(ingredients, materials) {
        this.elements.recipeList.innerHTML = '';
        let totalCost = 0;
        ingredients.forEach((ing, index) => {
            const material = materials.find(m => m.id === ing.materialId);
            if (material) {
                const cost = (ing.quantity * material.cost).toFixed(2);
                totalCost += parseFloat(cost);
                const li = document.createElement('li');
                li.className = 'recipe-item';
                const span1 = document.createElement('span');
                span1.textContent = material.name + ' (' + ing.quantity + ' ' + material.unit + ')';
                const span2 = document.createElement('span');
                span2.textContent = '$' + cost + ' ';
                const removeBtn = document.createElement('button');
                removeBtn.className = 'action-btn danger';
                removeBtn.style.cssText = 'padding: 2px 6px; margin-left: 8px;';
                removeBtn.textContent = 'x';
                removeBtn.onclick = () => App.removeIngredient(index);
                span2.appendChild(removeBtn);
                li.appendChild(span1);
                li.appendChild(span2);
                this.elements.recipeList.appendChild(li);
            }
        });
        document.getElementById('product-total-cost').textContent = '$' + totalCost.toFixed(2);
        return totalCost;
    },

    showBulkCalculator(products) {
        const select = document.getElementById('bulk-product');
        if (!select) {
            return;
        }
        select.innerHTML = '<option value="">Seleccionar Producto...</option>';
        if (products && products.length > 0) {
            products.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name + ' ($' + p.totalCost.toFixed(2) + ')';
                select.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay productos disponibles';
            select.appendChild(option);
        }
        this.showModal('modal-bulk');
    },

    showGallery(products) {
        const gallery = document.getElementById('gallery-grid');
        gallery.innerHTML = '';

        const productsWithImages = products.filter(p => p.image || p.image_url);

        if (productsWithImages.length === 0) {
            gallery.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted); grid-column: 1/-1;"><p>No hay productos con imágenes aún</p><p style="margin-top: 10px; font-size: 0.9rem;">Agrega imágenes a tus productos para crear tu catálogo visual</p></div>';
        } else {
            productsWithImages.forEach(product => {
                const card = document.createElement('div');
                card.className = 'gallery-item';
                const imgUrl = product.image_url || product.image;
                card.innerHTML = '<img src="' + imgUrl + '" alt="' + product.name + '"><div class="gallery-info"><h4>' + product.name + '</h4><p>' + (product.category || 'General') + '</p><p class="price">$' + product.price.toFixed(2) + '</p></div>';
                gallery.appendChild(card);
            });
        }

        this.showModal('modal-gallery');
    }
};
