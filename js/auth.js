const Auth = {
    STORAGE_KEY: 'bonitas_creaciones_users',
    CURRENT_USER_KEY: 'bonitas_creaciones_current_user',
    currentUser: null,
    useSupabase: false,
    listenersInitialized: false, // Bandera para evitar duplicación de listeners

    async init() {
        // Verificar si Supabase está disponible
        this.useSupabase = SUPABASE_CONFIG.useSupabase && supabaseClient !== null;
        
        if (this.useSupabase) {
            console.log('🔐 Modo: Supabase Auth');
        } else {
            console.log('🔐 Modo: Local Storage Auth');
        }

        // Solo configurar listeners una vez
        if (!this.listenersInitialized) {
            this.setupAuthListeners();
            this.listenersInitialized = true;
        }
        
        await this.checkAuthState();
    },

    async checkAuthState() {
        if (this.useSupabase) {
            // Verificar sesión en Supabase
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                // Asegurar que el perfil existe en user_profiles
                await this.ensureUserProfile(session.user);
                
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

    async ensureUserProfile(user) {
        try {
            // Verificar si el perfil ya existe
            const { data: existingProfile } = await supabaseClient
                .from('user_profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();
            
            // Si no existe, crearlo
            if (!existingProfile) {
                const username = user.user_metadata?.username || user.email.split('@')[0];
                const name = user.user_metadata?.name || user.email.split('@')[0];
                
                const { error } = await supabaseClient
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        username: username,
                        email: user.email,
                        name: name
                    });
                
                if (error) {
                    console.error('Error al crear perfil automáticamente:', error);
                } else {
                    console.log('✓ Perfil creado automáticamente para:', username);
                }
            }
        } catch (error) {
            console.error('Error en ensureUserProfile:', error);
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
            // Login con Supabase
            try {
                let loginEmail = username;
                
                // Si no tiene @, buscar el email por username en la tabla user_profiles
                if (!username.includes('@')) {
                    const { data: profileData, error: profileError } = await supabaseClient
                        .from('user_profiles')
                        .select('email')
                        .eq('username', username)
                        .single();
                    
                    if (profileError || !profileData) {
                        this.showMessage('Usuario no encontrado', 'danger');
                        return;
                    }
                    
                    loginEmail = profileData.email;
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

                // Asegurar que el perfil existe
                await this.ensureUserProfile(data.user);

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
                        emailRedirectTo: 'https://takuas77.github.io/BonitasCreaciones/',
                        data: {
                            name: name,
                            username: username
                        }
                    }
                });

                if (error) {
                    console.error('Error en signup:', error);
                    if (error.message.includes('already registered')) {
                        this.showMessage('Este email ya está registrado', 'danger');
                    } else {
                        this.showMessage(error.message, 'danger');
                    }
                    return;
                }

                // El perfil se creará automáticamente al hacer login la primera vez
                this.showMessage('¡Cuenta creada! Revisa tu email para confirmar tu cuenta', 'success');
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
            
            // Limpiar estado de la aplicación
            if (typeof App !== 'undefined' && App.state) {
                App.state.materials = [];
                App.state.products = [];
                App.state.history = [];
                App.state.currentRecipe = [];
                App.state.currentProductImage = '';
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
        
        // Resetear navegación al dashboard
        this.resetNavigation();
        
        // Inicializar la aplicación si no ha sido inicializada
        if (typeof App !== 'undefined' && App.init) {
            await App.init();
        }
    },

    resetNavigation() {
        // Resetear todos los botones de navegación
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => btn.classList.remove('active'));
        
        // Activar el botón del dashboard
        const dashboardBtn = document.querySelector('.nav-btn[data-target="dashboard"]');
        if (dashboardBtn) {
            dashboardBtn.classList.add('active');
        }
        
        // Ocultar todas las vistas
        const views = document.querySelectorAll('.view');
        views.forEach(v => {
            v.classList.remove('active');
            v.classList.add('hidden');
        });
        
        // Mostrar solo el dashboard
        const dashboardView = document.getElementById('dashboard');
        if (dashboardView) {
            dashboardView.classList.remove('hidden');
            dashboardView.classList.add('active');
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
        notification.className = 'notification notification-' + type;
        notification.style.cssText = `
            pointer-events: auto;
            max-width: 350px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                // Limpiar contenedor si está vacío
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
