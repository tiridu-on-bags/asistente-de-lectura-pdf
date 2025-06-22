# Asistente de Lectura PDF con Gemini

Este proyecto es una aplicación web que te permite **subir un archivo PDF**, hacerle preguntas en lenguaje natural y obtener respuestas automáticas utilizando la inteligencia artificial de Google Gemini. Ideal para resumir documentos, extraer información clave, o resolver dudas sobre cualquier PDF de manera sencilla.

## Características

- **Sube cualquier PDF** desde tu computadora.
- **Escribe una pregunta** sobre el contenido del PDF (ejemplo: "Resume este documento", "¿Cuáles son los puntos clave?", "¿Qué dice sobre X tema?").
- **Recibe una respuesta generada por IA** en cuestión de segundos.
- Interfaz simple y amigable basada en HTML y TypeScript.
- Utiliza la API de Google Gemini para la comprensión y generación de texto.

## Instalación y uso local

**Requisitos previos:** Tener [Node.js](https://nodejs.org/) instalado.

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tiridu-on-bags/asistente-de-lectura-pdf.git
   cd asistente-de-lectura-pdf
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea el archivo `.env.local` en la raíz del proyecto y coloca tu clave de API de Gemini:
   ```
   API_KEY=tu_clave_api_de_gemini
   ```
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```
5. Abre tu navegador en [http://localhost:5173](http://localhost:5173) (puerto por defecto de Vite).

## Uso

1. Sube un archivo PDF usando el formulario.
2. Escribe cualquier pregunta sobre el PDF.
3. Haz clic en "Procesar PDF" y espera la respuesta que aparecerá debajo.

## Tecnologías utilizadas

- [Vite](https://vitejs.dev/) para el entorno de desarrollo.
- [TypeScript](https://www.typescriptlang.org/)
- [Google Gemini GenAI API](https://ai.google.dev/)
- HTML y CSS

## Advertencia de seguridad

- **No compartas tu clave de API de Gemini** en lugares públicos ni la muestres en videos o capturas.
- La clave se gestiona desde variables de entorno y nunca debe estar hardcodeada en el código fuente.

## Créditos

Desarrollado por [tiridu-on-bags](https://github.com/tiridu-on-bags).

---

¡Clona el repo y comparte lo que hagas!
