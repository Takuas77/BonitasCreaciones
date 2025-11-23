const Auth = {
    currentUser: null,

    init() {
        this.checkAuthState();
        this.setupAuthListeners();
    },

    async checkAuthState() {
        if (!SupabaseClient.client) {
            // Si no hay Supabase configurado, permitir acceso local
            this.showApp();
            return;
        }

        try {
            const { data: { session } } = await SupabaseClient.client.auth.getSession();

            if (session) {
                this.currentUser = session.user;
                this.showApp();
                this.updateUserUI();
            } else {
                this.showLogin();
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
            this.showApp(); // Fallback to local mode
        }
    },

    setupAuthListeners() {
        // Listen for auth state changes
        if (SupabaseClient.client) {
            SupabaseClient.client.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    this.currentUser = session.user;
                    this.showApp();
                    this.updateUserUI();
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.showLogin();
                }
            });
        }

        // Login form
        document.getElementById('form-login')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Register form
        document.getElementById('form-register')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Logout button
        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            await this.handleLogout();
        });

        // Toggle between login and register
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    },

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    async handleLogin() {
        const email = this.sanitizeInput(document.getElementById('login-email').value.trim());
        const password = document.getElementById('login-password').value;

        if (!this.validateEmail(email)) {
            alert('❌ Por favor ingresa un email válido.');
            return;
        }

        if (password.length < 6) {
            alert('❌ La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            const { data, error } = await SupabaseClient.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.showNotification('✅ Inicio de sesión exitoso', 'success');
        } catch (error) {
            console.error('Login error:', error);
            alert(`❌ Error al iniciar sesión: ${error.message}`);
        }
    },

    async handleRegister() {
        const email = this.sanitizeInput(document.getElementById('register-email').value.trim());
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (!this.validateEmail(email)) {
            alert('❌ Por favor ingresa un email válido.');
            return;
        }

        if (password.length < 6) {
            alert('❌ La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            alert('❌ Las contraseñas no coinciden.');
            return;
        }

        try {
            const { data, error } = await SupabaseClient.client.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            alert('✅ Registro exitoso. Por favor revisa tu email para confirmar tu cuenta.');
            this.showLoginForm();
        } catch (error) {
            console.error('Register error:', error);
            alert(`❌ Error al registrarse: ${error.message}`);
        }
    },

    async handleLogout() {
        if (!SupabaseClient.client) return;

        try {
            const { error } = await SupabaseClient.client.auth.signOut();
            if (error) throw error;

            this.showNotification('Sesión cerrada correctamente', 'info');
        } catch (error) {
            console.error('Logout error:', error);
            alert(`❌ Error al cerrar sesión: ${error.message}`);
        }
    },

    showLogin() {
        document.getElementById('auth-screen')?.classList.remove('hidden');
        document.getElementById('app-screen')?.classList.add('hidden');
        this.showLoginForm();
    },

    showApp() {
        document.getElementById('auth-screen')?.classList.add('hidden');
        document.getElementById('app-screen')?.classList.remove('hidden');
    },

    showLoginForm() {
        document.getElementById('login-form-container')?.classList.remove('hidden');
        document.getElementById('register-form-container')?.classList.add('hidden');
    },

    showRegisterForm() {
        document.getElementById('login-form-container')?.classList.add('hidden');
        document.getElementById('register-form-container')?.classList.remove('hidden');
    },

    updateUserUI() {
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement && this.currentUser) {
            userEmailElement.textContent = this.currentUser.email;
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
        }, 3000);
    }
};

// Initialize auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Supabase to initialize
    setTimeout(() => {
        Auth.init();
    }, 500);
});
