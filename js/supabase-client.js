
const SupabaseClient = {
    client: null,
    isConnected: false,

    init() {
        const url = localStorage.getItem('supabase_url');
        const key = localStorage.getItem('supabase_key');

        if (url && key && window.supabase) {
            try {
                this.client = window.supabase.createClient(url, key);
                this.testConnection();
            } catch (error) {
                console.error("Error initializing Supabase:", error);
                this.isConnected = false;
                this.showNotification('Error al inicializar Supabase', 'error');
            }
        }
    },

    async testConnection() {
        if (!this.client) return;
        try {
            const { data, error } = await this.client.from('materials').select('count', { count: 'exact', head: true });
            if (!error) {
                this.isConnected = true;
                console.log("Supabase Connected!");
                this.updateStatusUI(true);
                this.showNotification('✅ Conectado a Supabase correctamente', 'success');
            } else {
                throw error;
            }
        } catch (e) {
            console.error("Supabase Connection Failed:", e);
            this.isConnected = false;
            this.updateStatusUI(false);
            this.showNotification('❌ Error al conectar con Supabase. Usando almacenamiento local.', 'error');
        }
    },

    updateStatusUI(connected) {
        const indicator = document.getElementById('db-status-indicator');
        if (indicator) {
            indicator.style.backgroundColor = connected ? '#4ade80' : '#f87171';
            indicator.title = connected ? 'Conectado a Supabase' : 'Desconectado (Usando LocalStorage)';
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#6366f1')};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    },

    saveCredentials(url, key) {
        localStorage.setItem('supabase_url', url);
        localStorage.setItem('supabase_key', key);
        this.showNotification('⏳ Conectando a Supabase...', 'info');
        setTimeout(() => {
            window.location.reload(); // Reload to apply changes cleanly
        }, 1000);
    },

    clearCredentials() {
        localStorage.removeItem('supabase_url');
        localStorage.removeItem('supabase_key');
        this.showNotification('Desconectado de Supabase. Usando almacenamiento local.', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    SupabaseClient.init();
});
