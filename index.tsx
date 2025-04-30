// EN TU ARCHIVO index.tsx (adaptado de la respuesta anterior)

import { GoogleGenAI, createPartFromUri } from "@google/genai";

// --- Elementos de la UI (asegúrate que existan en tu index.html) ---
const fileInput = document.getElementById('pdfFile') as HTMLInputElement;
const promptInput = document.getElementById('userPrompt') as HTMLInputElement;
const processButton = document.getElementById('processButton') as HTMLButtonElement;
const responseArea = document.getElementById('responseArea') as HTMLDivElement;

// --- Configuración de Gemini ---
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!! ¡¡¡PELIGRO!!! NO MUESTRES ESTA LÍNEA EN TU VIDEO !!!!!!
// !!!!!       DIFUMINA/CUBRE ESTA LÍNEA COMPLETAMENTE       !!!!!!
// !!!!! CONSIDERA REVOCAR LA CLAVE DESPUÉS DE GRABAR        !!!!!!
const GEMINI_API_KEY = process.env.API_KEY;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

if (!GEMINI_API_KEY) {
     responseArea.textContent = "Error: No se detectó API Key en el entorno";
     // Deshabilita el botón si no hay clave para evitar errores innecesarios
     if (processButton) processButton.disabled = true;
}

// Solo inicializa si la clave parece estar presente
let ai: GoogleGenAI | null = null;
try {
    if (GEMINI_API_KEY && GEMINI_API_KEY !== '') {
        ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); // Corrected initialization
    }
} catch (error) {
    console.error("Error initializing GoogleGenAI:", error);
    responseArea.textContent = "Error: No se pudo inicializar GoogleGenAI.";
}

// --- Función Principal de Procesamiento ---
async function processPDF(pdfFile: globalThis.File, userPrompt: string) {
    if (!ai) {
        responseArea.textContent = "Error: Gemini AI no inicializado. ¿Falta la API Key?";
        return;
    }
    if (!pdfFile) {
        responseArea.textContent = "Por favor, selecciona un archivo PDF.";
        return;
    }
    if (!userPrompt) {
        responseArea.textContent = "Por favor, ingresa una pregunta sobre el PDF.";
        return;
    }

    responseArea.textContent = "Subiendo y procesando PDF...";
    if(processButton) processButton.disabled = true;

    try {
        // 1. Subir archivo
        console.log("Subiendo archivo:", pdfFile.name);
        const uploadResult = await ai.files.upload({
            file: pdfFile,
            config: { displayName: pdfFile.name },
        });
        console.log("Subido:", uploadResult.name, "Estado:", uploadResult.state);
        responseArea.textContent = "Archivo subido. Esperando procesamiento...";

        // 2. Esperar procesamiento
        let file = await ai.files.get({ name: uploadResult.name });
        while (file.state === 'PROCESSING') {
            console.log(`Estado: ${file.state}. Esperando 5s...`);
            responseArea.textContent = `Procesando archivo (${file.state})...`;
            await new Promise(resolve => setTimeout(resolve, 5000));
            file = await ai.files.get({ name: uploadResult.name });
        }

        if (file.state === 'FAILED') throw new Error(`Falló el procesamiento: ${file.state}`);
        if (file.state !== 'ACTIVE') throw new Error(`Estado inesperado: ${file.state}`);
        if (!file.uri || !file.mimeType) throw new Error('Falta URI/mimeType.');

        console.log("Archivo listo:", file.name, "URI:", file.uri);
        responseArea.textContent = "Archivo procesado. Generando respuesta...";

        // 3. Preparar contenido
        const pdfPart = createPartFromUri(file.uri, file.mimeType);
        const contents = [{ text: userPrompt }, pdfPart];

        // 4. Llamar a generateContent
        const model = "gemini-1.5-flash"; // O 1.5-pro
        console.log(`Enviando a ${model}...`);
        const result = await ai.models.generateContent({ model, contents });
        const responseText = result.text;

        console.log("Respuesta:", responseText);
        responseArea.textContent = responseText;

        // 5. (Opcional) Borrar archivo
        if (file.name) {
            console.log("Borrando archivo:", file.name);
            await ai.files.delete({ name: file.name });
            console.log("Archivo borrado.");
        } else {
            console.error("Error: Nombre de archivo no disponible para borrar");
        }

    } catch (error: any) { // Tipar error como 'any' o 'unknown' para acceder a message
        console.error("Error procesando el PDF:", error);
        responseArea.textContent = `Error: ${error.message || error}`;
    } finally {
        if(processButton) processButton.disabled = false;
    }
}

// --- Event Listener ---
if (processButton && fileInput && promptInput && responseArea) {
    processButton.addEventListener('click', () => {
        const selectedFile = fileInput.files ? fileInput.files[0] : null;
        const promptText = promptInput.value;

        if (selectedFile && ai) { // Verifica que 'ai' esté inicializado
            processPDF(selectedFile, promptText);
        } else if (!selectedFile) {
            responseArea.textContent = "Por favor, selecciona un archivo PDF.";
        } else {
             responseArea.textContent = "Error de configuración: Falta API Key.";
        }
    });

    // Mensaje inicial solo si todo está listo
    if (!GEMINI_API_KEY) {
         responseArea.textContent = "Error: No se detectó API Key en el entorno";
    } else {
         responseArea.textContent = "Sube un PDF, escribe tu pregunta y presiona 'Procesar PDF'.";
    }

} else {
    console.error("Error: No se encontraron todos los elementos de la UI necesarios (pdfFile, userPrompt, processButton, responseArea). Revisa tu HTML.");
    // Podrías mostrar un error en el body si la responseArea no existe
    if (document.body) document.body.innerText = "Error crítico: Faltan elementos HTML.";
}

console.log("Asistente PDF listo (si la API Key está configurada).");