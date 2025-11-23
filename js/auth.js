const Auth = {
    STORAGE_KEY: 'bonitas_creaciones_users',
    CURRENT_USER_KEY: 'bonitas_creaciones_current_user',
    currentUser: null,
    useSupabase: false,

    async init() {
        // Verificar si Supabase está disponible
        this.useSupabase = SUPABASE_CONFIG.useSupabase && supabaseClient !== null;
        
        if (this.useSupabase) {
            console.log('🔐 Modo: Supabase Auth');
        } else {
            console.log('🔐 Modo: Local Storage Auth');
        }

        this.setupAuthListeners();
        await this.checkAuthState();
    },

    async checkAuthState() {
        if (this.useSupabase) {
            // Verificar sesión en Supabase
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                this.currentUser = {
                    id: session.user.id,
                    username: session.user.user_metadata?.username || session.user.email.split('@')[0],
                    name: session.user.user_metadata?.name || session.user.email.split('@')[0]
                };
                this.showApp();
                this.updateUserUI();
            } else {
                this.showLogin();
            }
        } else {
            // Modo local storage
            const localUser = this.getLocalCurrentUser();
            if (localUser) {
                this.currentUser = localUser;
                this.showApp();
                this.updateUserUI();
            } else {
                this.showLogin();
            }
        }
    },

    setupAuthListeners() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('btn-logout').addEventListener('click', () => {
            this.logout();
        });
    },

    showLoginForm() {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
    },

    showRegisterForm() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    },

    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showMessage('Por favor completa todos los campos', 'danger');
            return;
        }

        if (this.useSupabase) {
            // Login con Supabase usando email
            try {
                // Si el usuario ingresó un username, asumimos que es el formato interno
                let loginEmail = username;
                if (!username.includes('@')) {
                    loginEmail = `${username}@bonitascreaciones.local`;
                }
                
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: loginEmail,
                    password: password
                });

                if (error) {
                    this.showMessage(error.message === 'Invalid login credentials' 
                        ? 'Usuario/email o contraseña incorrectos' 
                        : error.message, 'danger');
                    return;
                }

                this.currentUser = {
                    id: data.user.id,
                    username: data.user.user_metadata?.username || data.user.email.split('@')[0],
                    name: data.user.user_metadata?.name || data.user.email.split('@')[0],
                    email: data.user.email
                };

                this.showMessage('¡Bienvenid@!', 'success');
                
                setTimeout(async () => {
                    await this.showApp();
                    this.updateUserUI();
                }, 500);

            } catch (error) {
                console.error('Error en login:', error);
                this.showMessage('Error al iniciar sesión', 'danger');
            }
        } else {
            // Login local - puede usar username o email
            const users = this.getUsers();
            const user = users.find(u => u.username === username || u.email === username);

            if (!user) {
                this.showMessage('Usuario o email no encontrado', 'danger');
                return;
            }

            if (user.password !== this.hashPassword(password)) {
                this.showMessage('Contraseña incorrecta', 'danger');
                return;
            }

            this.currentUser = {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email
            };
            
            this.setLocalCurrentUser(this.currentUser);
            this.showMessage('¡Bienvenid@!', 'success');
            
            setTimeout(async () => {
                await this.showApp();
                this.updateUserUI();
            }, 500);
        }
    },

    async handleRegister() {
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;

        if (!name || !email || !username || !password || !passwordConfirm) {
            this.showMessage('Por favor completa todos los campos', 'danger');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Por favor ingresa un email válido', 'danger');
            return;
        }

        if (username.length < 3) {
            this.showMessage('El usuario debe tener al menos 3 caracteres', 'danger');
            return;
        }

        if (password.length < 6) {
            this.showMessage('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }

        if (password !== passwordConfirm) {
            this.showMessage('Las contraseñas no coinciden', 'danger');
            return;
        }

        if (this.useSupabase) {
            // Registro con Supabase usando el email real
            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            name: name,
                            username: username
                        }
                    }
                });

                if (error) {
                    if (error.message.includes('already registered')) {
                        this.showMessage('Este email ya está registrado', 'danger');
                    } else {
                        this.showMessage(error.message, 'danger');
                    }
                    return;
                }

                this.showMessage('¡Cuenta creada! Revisa tu email para confirmar', 'success');
                document.getElementById('register-form').reset();
                
                setTimeout(() => {
                    this.showLoginForm();
                }, 2000);

            } catch (error) {
                console.error('Error en registro:', error);
                this.showMessage('Error al crear la cuenta', 'danger');
            }
        } else {
            // Registro local
            const users = this.getUsers();
            
            if (users.find(u => u.username === username)) {
                this.showMessage('Este usuario ya existe', 'danger');
                return;
            }

            if (users.find(u => u.email === email)) {
                this.showMessage('Este email ya está registrado', 'danger');
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                username,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            this.saveUsers(users);

            this.showMessage('¡Cuenta creada exitosamente!', 'success');
            document.getElementById('register-form').reset();
            
            setTimeout(() => {
                this.showLoginForm();
            }, 1000);
        }
    },

    async logout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            if (this.useSupabase) {
                // Logout de Supabase
                try {
                    await supabaseClient.auth.signOut();
                } catch (error) {
                    console.error('Error en logout:', error);
                }
            }
            
            this.currentUser = null;
            localStorage.removeItem(this.CURRENT_USER_KEY);
            this.showMessage('Sesión cerrada', 'info');
            setTimeout(() => {
                this.showLogin();
                document.getElementById('login-form').reset();
                this.showLoginForm();
            }, 500);
        }
    },

    getUsers() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveUsers(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    },

    getLocalCurrentUser() {
        const data = localStorage.getItem(this.CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    },

    setLocalCurrentUser(user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    },

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    },

    showLogin() {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.querySelector('.app-container').classList.add('hidden');
    },

    async showApp() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.querySelector('.app-container').classList.remove('hidden');
        
        // Inicializar la aplicación si no ha sido inicializada
        if (typeof App !== 'undefined' && App.init) {
            await App.init();
        }
    },

    updateUserUI() {
        if (this.currentUser) {
            const brandText = document.querySelector('.brand-text h1');
            if (brandText) {
                brandText.textContent = 'Hola ' + this.currentUser.name + '! 👋';
            }
        }
    },

    showMessage(message, type = 'info') {
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

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
