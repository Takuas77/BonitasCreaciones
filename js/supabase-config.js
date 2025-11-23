// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales de Supabase
const SUPABASE_CONFIG = {
    url: 'https://rrmjhtqpkdakagzbtkxi.supabase.co', // ejemplo: https://xxxxxxxxxxxxx.supabase.co
    anonKey: 'sb_publishable_LDlqL6Z4y-8Ta-n6uZAB7A_ISMtVmb2', // tu clave pública/anon
    useSupabase: true // Cambia a true cuando tengas las credenciales configuradas
};

// Inicializar cliente de Supabase solo si useSupabase es true
let supabaseClient = null;

if (SUPABASE_CONFIG.useSupabase && typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('✓ Supabase inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar Supabase:', error);
        SUPABASE_CONFIG.useSupabase = false;
    }
}
