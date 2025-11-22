INSTRUCCIONES PARA AGREGAR EL LOGO:

1. Guarda la imagen del logo (Bonitas_Creaciones_logo.png) en la carpeta "images"

2. El HTML ya está configurado para mostrar el logo. Solo necesitas:
   - Colocar el archivo de imagen en: calculadora_costos/images/logo.png
   
3. Luego actualiza el src en index.html línea 23:
   Cambiar:
   src="data:image/png;base64,..." 
   
   Por:
   src="images/logo.png"

Alternativamente, puedes convertir la imagen a Base64 y pegarla directamente en el HTML.

Para convertir a Base64:
1. Ve a: https://base64.guru/converter/encode/image
2. Sube la imagen del logo
3. Copia el código Base64 completo
4. Pégalo en el atributo src del img en index.html
