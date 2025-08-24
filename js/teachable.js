// teachable.js - Lógica de búsqueda por imagen con Teachable Machine

// Ruta a tu modelo (ajusta si tu carpeta se llama diferente)
const URL_MODEL = './teachable-machine/';

let model = null;
let stream = null;

// Cargar el modelo
async function cargarModelo() {
  if (model) return;

  try {
    const modelURL = URL_MODEL + 'model.json';
    const metadataURL = URL_MODEL + 'metadata.json';
    
    // Cargar modelo
    model = await tmImage.load(modelURL, metadataURL);
    console.log('✅ Modelo cargado:', model);

    // Preparar contenedor de resultados
    const labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = '<h6 style="color:#007bff;">Predicciones:</h6>';
    
    // Crear una línea por cada clase
    for (let i = 0; i < model.getTotalClasses(); i++) {
      const div = document.createElement('div');
      div.style.fontWeight = 'bold';
      div.style.margin = '4px 0';
      div.style.padding = '6px';
      div.style.backgroundColor = '#f8f9fa';
      div.style.borderRadius = '4px';
      labelContainer.appendChild(div);
    }

  } catch (error) {
    console.error('❌ Error al cargar el modelo:', error);
    alert('No se pudo cargar el modelo. Verifica:\n- Que la carpeta "teachable-machine" exista\n- Que tenga model.json, metadata.json y weights.bin\n- Usa live-server o python -m http.server');
  }
}

// Abrir cámara o subir imagen
async function abrirBusquedaPorImagen() {
  await cargarModelo();
  
  const usarCamara = confirm('¿Usar cámara? Aceptar para cámara, Cancelar para subir imagen');
  if (usarCamara) {
    iniciarCamara();
  } else {
    subirImagen();
  }
}

// Iniciar cámara
async function iniciarCamara() {
  const webcamContainer = document.getElementById('webcam-container');
  const video = document.getElementById('webcam');
  webcamContainer.style.display = 'block';

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Esperar a que el video cargue
    video.onloadedmetadata = () => {
      console.log('📹 Video listo. Iniciando detección...');
      detectarEnCamara();
    };
  } catch (err) {
    console.error('❌ Error al acceder a la cámara:', err);
    alert('Error al acceder a la cámara: ' + err.message);
  }
}

// Detener cámara
function detenerCamara() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  document.getElementById('webcam-container').style.display = 'none';
  document.getElementById('label-container').innerHTML = '<h6 style="color:#007bff;">Predicciones:</h6>';
}

// Detectar en tiempo real
async function detectarEnCamara() {
  if (!stream || !model) return;

  const video = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Asegurar tamaño del canvas
  canvas.width = 224;
  canvas.height = 224;

  // Dibujar frame actual del video en el canvas
  ctx.drawImage(video, 0, 0, 224, 224);

  try {
    // Predecir desde el canvas
    const prediction = await model.predict(canvas);
    mostrarResultados(prediction);
  } catch (err) {
    console.error('❌ Error en predicción:', err);
  }

  // Repetir en bucle
  requestAnimationFrame(detectarEnCamara);
}

// Subir imagen desde archivo
function subirImagen() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      // Ajustar canvas a 224x224
      canvas.width = 224;
      canvas.height = 224;
      ctx.drawImage(img, 0, 0, 224, 224);

      try {
        const prediction = await model.predict(canvas);
        const labelContainer = document.getElementById('label-container');
        labelContainer.innerHTML = '<h6 style="color:#007bff;">Resultado:</h6>';
        
        // Crear elementos si no existen
        for (let i = 0; i < prediction.length; i++) {
          const div = document.createElement('div');
          div.style.fontWeight = 'bold';
          div.style.margin = '4px 0';
          div.style.padding = '6px';
          div.style.backgroundColor = '#f8f9fa';
          div.style.borderRadius = '4px';
          labelContainer.appendChild(div);
        }

        mostrarResultados(prediction);
      } catch (err) {
        console.error('❌ Error al predecir imagen:', err);
      }
    };
  };
  
  input.click();
}

// Mostrar resultados
function mostrarResultados(prediction) {
  const labelContainer = document.getElementById('label-container');
  const divs = labelContainer.querySelectorAll('div');

  prediction.forEach((pred, i) => {
    const prob = (pred.probability * 100).toFixed(2);
    if (divs[i]) {
      divs[i].textContent = `${pred.className}: ${prob}%`;
    }
  });
}
// Exponer la función al objeto global (window)
window.abrirBusquedaPorImagen = abrirBusquedaPorImagen;