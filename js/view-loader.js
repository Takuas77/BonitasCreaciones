/**
 * ViewLoader - Sistema de carga dinámica de vistas y modales
 * Gestiona la carga y visualización de componentes HTML externos
 */

const ViewLoader = {
    // Cache para almacenar vistas y modales ya cargados
    cache: {
        views: {},
        modals: {}
    },

    // Contenedores principales
    containers: {
        views: null,
        modals: null,
        auth: null
    },

    /**
     * Inicializa el ViewLoader
     */
    init() {
        this.containers.views = document.querySelector('main');
        this.containers.modals = document.getElementById('modals-container');
        this.containers.auth = document.getElementById('auth-container');

        if (!this.containers.modals) {
            const modalsContainer = document.createElement('div');
            modalsContainer.id = 'modals-container';
            document.body.appendChild(modalsContainer);
            this.containers.modals = modalsContainer;
        }

        console.log('✅ ViewLoader inicializado');
    },

    /**
     * Carga una vista desde views/
     * @param {string} viewName - Nombre de la vista (sin extensión)
     * @param {boolean} showLoader - Mostrar indicador de carga
     * @returns {Promise<boolean>}
     */
    async loadView(viewName, showLoader = true) {
        try {
            if (showLoader) this.showLoadingIndicator();

            // Verificar si está en caché
            if (this.cache.views[viewName]) {
                this.renderView(viewName);
                if (showLoader) this.hideLoadingIndicator();
                return true;
            }

            // Cargar vista desde archivo
            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar la vista: ${viewName}`);
            }

            const html = await response.text();
            this.cache.views[viewName] = html;
            this.renderView(viewName);

            if (showLoader) this.hideLoadingIndicator();
            
            console.log(`✅ Vista cargada: ${viewName}`);
            return true;

        } catch (error) {
            console.error(`❌ Error cargando vista ${viewName}:`, error);
            if (showLoader) this.hideLoadingIndicator();
            this.showError(`No se pudo cargar la vista: ${viewName}`);
            return false;
        }
    },

    /**
     * Renderiza una vista desde el caché
     * @param {string} viewName 
     */
    renderView(viewName) {
        if (!this.containers.views) return;

        const html = this.cache.views[viewName];
        if (!html) return;

        // Limpiar contenedor de vistas
        this.containers.views.innerHTML = html;

        // Obtener la vista que se acaba de cargar
        const viewElement = this.containers.views.querySelector('.view');
        
        console.log('🔍 ViewElement encontrado:', !!viewElement);
        console.log('🔍 Clases antes:', viewElement?.className);
        
        if (viewElement) {
            // Remover clase hidden si existe
            viewElement.classList.remove('hidden');
            // Agregar clase active para mostrar la vista
            viewElement.classList.add('active');
            console.log('✅ Clase hidden removida y active agregada');
        }
        
        console.log('🔍 Clases después:', viewElement?.className);
        console.log('🔍 Display style:', viewElement ? window.getComputedStyle(viewElement).display : 'N/A');

        // Disparar evento personalizado para que otros módulos sepan que la vista cambió
        document.dispatchEvent(new CustomEvent('viewLoaded', { 
            detail: { viewName } 
        }));
    },

    /**
     * Carga un modal desde modals/
     * @param {string} modalName - Nombre del modal (sin extensión)
     * @returns {Promise<boolean>}
     */
    async loadModal(modalName) {
        try {
            // Verificar si está en caché
            if (this.cache.modals[modalName]) {
                this.renderModal(modalName);
                return true;
            }

            // Cargar modal desde archivo
            const response = await fetch(`modals/${modalName}.html`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el modal: ${modalName}`);
            }

            const html = await response.text();
            this.cache.modals[modalName] = html;
            this.renderModal(modalName);

            console.log(`✅ Modal cargado: ${modalName}`);
            return true;

        } catch (error) {
            console.error(`❌ Error cargando modal ${modalName}:`, error);
            this.showError(`No se pudo cargar el modal: ${modalName}`);
            return false;
        }
    },

    /**
     * Renderiza un modal desde el caché
     * @param {string} modalName 
     */
    renderModal(modalName) {
        if (!this.containers.modals) return;

        const html = this.cache.modals[modalName];
        if (!html) return;

        // Verificar si el modal ya existe en el DOM
        const modalId = `modal-${modalName.replace('-modal', '')}`;
        if (document.getElementById(modalId)) {
            return; // Modal ya existe
        }

        // Agregar modal al contenedor
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        this.containers.modals.appendChild(tempDiv.firstElementChild);

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('modalLoaded', { 
            detail: { modalName } 
        }));
    },

    /**
     * Carga todos los modales necesarios
     * @returns {Promise<void>}
     */
    async loadAllModals() {
        const modals = [
            'material-modal',
            'product-modal',
            'sale-modal',
            'bulk-modal',
            'export-modal',
            'gallery-modal',
            'settings-modal'
        ];

        console.log('⏳ Cargando modales...');

        const promises = modals.map(modal => this.loadModal(modal));
        await Promise.all(promises);

        console.log('✅ Todos los modales cargados');
    },

    /**
     * Carga la vista de autenticación
     * @returns {Promise<boolean>}
     */
    async loadAuthView() {
        try {
            const response = await fetch('views/auth.html');
            if (!response.ok) {
                throw new Error('No se pudo cargar la vista de autenticación');
            }

            const html = await response.text();
            
            if (!this.containers.auth) {
                const authContainer = document.createElement('div');
                authContainer.id = 'auth-container';
                document.body.insertBefore(authContainer, document.body.firstChild);
                this.containers.auth = authContainer;
            }

            this.containers.auth.innerHTML = html;
            console.log('✅ Vista de autenticación cargada');
            
            // Disparar evento para que Auth pueda configurar listeners
            document.dispatchEvent(new CustomEvent('authViewLoaded'));
            
            return true;

        } catch (error) {
            console.error('❌ Error cargando vista de autenticación:', error);
            return false;
        }
    },

    /**
     * Muestra indicador de carga
     */
    showLoadingIndicator() {
        if (!this.containers.views) return;

        const loader = document.createElement('div');
        loader.id = 'view-loader';
        loader.className = 'view-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <p>Cargando...</p>
        `;
        this.containers.views.appendChild(loader);
    },

    /**
     * Oculta indicador de carga
     */
    hideLoadingIndicator() {
        const loader = document.getElementById('view-loader');
        if (loader) {
            loader.remove();
        }
    },

    /**
     * Muestra mensaje de error
     * @param {string} message 
     */
    showError(message) {
        console.error(message);
        // Aquí podrías integrar con un sistema de notificaciones
        alert(message);
    },

    /**
     * Limpia el caché
     */
    clearCache() {
        this.cache.views = {};
        this.cache.modals = {};
        console.log('🗑️ Caché limpiado');
    },

    /**
     * Precarga vistas comunes para mejor rendimiento
     */
    async preloadCommonViews() {
        const commonViews = ['dashboard', 'materials', 'products', 'sales'];
        console.log('⏳ Precargando vistas comunes...');
        
        for (const view of commonViews) {
            await this.loadView(view, false);
        }
        
        console.log('✅ Vistas comunes precargadas');
    }
};

// Exportar para uso global
window.ViewLoader = ViewLoader;
