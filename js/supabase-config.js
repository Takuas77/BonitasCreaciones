// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales de Supabase
const SUPABASE_CONFIG = {
    url: 'https://rrmjhtqpkdakagzbtkxi.supabase.co', // ejemplo: https://xxxxxxxxxxxxx.supabase.co
    anonKey: 'sb_publishable_LDlqL6Z4y-8Ta-n6uZAB7A_ISMtVmb2', // tu clave pública/anon
    useSupabase: true, // Cambia a true cuando tengas las credenciales configuradas
    storageBucket: 'images' // Nombre del bucket para almacenar imágenes
};

// Inicializar cliente de Supabase solo si useSupabase es true
let supabaseClient = null;

if (SUPABASE_CONFIG.useSupabase && typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
    } catch (error) {
        SUPABASE_CONFIG.useSupabase = false;
    }
}

// Utilidades para Supabase Storage
const SupabaseStorage = {
    /**
     * Sube una imagen a Supabase Storage
     * @param {File} file - Archivo de imagen
     * @param {string} folder - Carpeta donde guardar (ej: 'products' o 'materials')
     * @param {string} userId - ID del usuario
     * @returns {Promise<{url: string, path: string} | null>}
     */
    async uploadImage(file, folder, userId) {
        if (!SUPABASE_CONFIG.useSupabase || !supabaseClient) {
            console.warn('Supabase no está habilitado');
            return null;
        }

        try {
            // Generar nombre único para el archivo
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${folder}/${crypto.randomUUID()}.${fileExt}`;

            // Subir archivo a Supabase Storage
            const { data, error } = await supabaseClient.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Obtener URL pública
            const { data: { publicUrl } } = supabaseClient.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .getPublicUrl(fileName);

            return {
                url: publicUrl,
                path: fileName
            };
        } catch (error) {
            console.error('Error al subir imagen:', error);
            return null;
        }
    },

    /**
     * Elimina una imagen de Supabase Storage
     * @param {string} filePath - Ruta del archivo en storage
     * @returns {Promise<boolean>}
     */
    async deleteImage(filePath) {
        if (!SUPABASE_CONFIG.useSupabase || !supabaseClient || !filePath) {
            return false;
        }

        try {
            const { error } = await supabaseClient.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .remove([filePath]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }
    },

    /**
     * Convierte un archivo a Base64 (fallback cuando Supabase no está disponible)
     * @param {File} file - Archivo de imagen
     * @returns {Promise<string>}
     */
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Extrae la ruta del archivo desde una URL de Supabase Storage
     * @param {string} url - URL pública de Supabase Storage
     * @returns {string | null}
     */
    extractPathFromUrl(url) {
        if (!url || !url.includes('/storage/v1/object/public/')) {
            return null;
        }
        
        try {
            const parts = url.split('/storage/v1/object/public/');
            if (parts.length < 2) return null;
            
            const pathParts = parts[1].split('/');
            // Remover el nombre del bucket del path
            pathParts.shift();
            return pathParts.join('/');
        } catch (error) {
            console.error('Error al extraer path:', error);
            return null;
        }
    }
};
