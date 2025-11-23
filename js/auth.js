const Auth = {
    STORAGE_KEY: 'bonitas_creaciones_users',
    CURRENT_USER_KEY: 'bonitas_creaciones_current_user',
    currentUser: null,
    useSupabase: false,
    listenersInitialized: false, // Bandera para evitar duplicación de listeners

    async init() {
        this.useSupabase = SUPABASE_CONFIG.useSupabase && supabaseClient !== null;
        
        // Escuchar cuando la vista de auth se carga para configurar listeners
        document.addEventListener('authViewLoaded', () => {
            if (!this.listenersInitialized) {
                this.setupAuthListeners();
                this.listenersInitialized = true;
            }
        }, { once: true }); // Solo una vez
        
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
                    // Error silencioso
                } else {
                    // Perfil creado
                }
            }
        } catch (error) {
            // Error silencioso
        }
    },

    setupAuthListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const showRegister = document.getElementById('show-register');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        const showLogin = document.getElementById('show-login');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                this.logout();
            });
        }
    },

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
    },

    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    },

    async handleLogin() {
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        
        if (!usernameInput || !passwordInput) {
            console.error('Elementos del formulario de login no encontrados');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

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

            const hashedPassword = this.hashPassword(password);
            
            if (user.password !== hashedPassword) {
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
        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const usernameInput = document.getElementById('register-username');
        const passwordInput = document.getElementById('register-password');
        const passwordConfirmInput = document.getElementById('register-password-confirm');
        
        if (!nameInput || !emailInput || !usernameInput || !passwordInput || !passwordConfirmInput) {
            console.error('Elementos del formulario de registro no encontrados');
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

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
                try {
                    await supabaseClient.auth.signOut();
                } catch (error) {
                    // Error silencioso
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
        const authScreen = document.getElementById('auth-screen');
        const appContainer = document.querySelector('.app-container');
        
        if (authScreen) {
            authScreen.classList.remove('hidden');
        }
        
        if (appContainer) {
            appContainer.classList.add('hidden');
        }
    },

    async showApp() {
        const authScreen = document.getElementById('auth-screen') || document.querySelector('#auth-container #auth-screen');
        if (authScreen) {
            authScreen.classList.add('hidden');
        }
        
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.classList.remove('hidden');
        } else {
            console.error('App container no encontrado');
            return;
        }
        
        // Cargar vista del dashboard
        await this.loadInitialView();
        
        // Inicializar la aplicación si no ha sido inicializada
        if (typeof App !== 'undefined' && App.init) {
            await App.init();
        }
    },

    async loadInitialView() {
        // Cargar dashboard como vista inicial
        await ViewLoader.loadView('dashboard');
        
        // Activar botón de navegación del dashboard
        const dashboardBtn = document.querySelector('.nav-btn[data-target="dashboard"]');
        if (dashboardBtn) {
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            dashboardBtn.classList.add('active');
        }
    },

    resetNavigation() {
        // Esta función ya no es necesaria con el nuevo sistema
        // pero la mantenemos para compatibilidad
    },

    updateUserUI() {
        if (this.currentUser) {
            const brandText = document.querySelector('.brand-text h1');
            if (brandText) {
                brandText.textContent = 'Hola ' + this.currentUser.name + '!';
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
