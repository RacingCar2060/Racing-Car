// Base de palabras clave para detectar intenciones (tolerante a errores)
const BASE_RESPUESTAS = {
  saludos: [
    "hola", "buenas", "buenos dias", "buenas tardes", "buenas noches",
    "hola buenas", "hey", "ola", "buen dia", "buenas a todos", "hola como estas",
    "holaa", "buen diaa", "buenas tardee", "ey", "holaai", "hoooola"
  ],
  productos: [
    "productos", "que venden", "que tienen", "que ofertan", "que vendes",
    "que cosas hay", "mostrar productos", "ver productos", "catálogo", "lista de productos",
    "que venden", "tienen", "ofrecen", "me muestras algo"
  ],
  luces: ["luces led", "led", "faros led", "focos led", "iluminacion led", "faros", "luces para auto", "mejorar luces"],
  balatas: ["balatas", "pastillas de freno", "frenos", "balatas de freno", "pastillas", "frenado"],
  autorradios: ["autorradios", "radio", "estereo", "bluetooth", "radio bluetooth", "pantalla tactil", "sonido auto", "sistema audio"],
  camaras: ["camaras", "camara retro", "retro", "vision nocturna", "cámara", "cámara reversa", "ayuda para estacionar"],
  manijas: ["manijas", "manija", "manillas", "manilla", "manija eléctrica", "puertas"],
  trabas: ["trabas", "traba electrica", "seguro electrico", "cerradura electrica", "traba central", "control remoto"],
  bujias: ["bujias", "bujía", "bujiás", "chispa", "bujías de encendido", "mejorar encendido"],
  filtros: ["filtros", "filtro de aire", "filtro de aceite", "filtro combustible", "cambiar filtro", "aire", "aceite"],
  cobertores: ["cobertores", "cobertor", "funda", "funda para auto", "proteccion auto", "cubrir auto"],

  mejoras: ["recomiendame", "mejoras", "que me recomiendas", "ideas para mi auto", "mejorar mi auto", "mejor producto"],
  ofertas: ["ofertas", "descuentos", "promociones", "precios", "hay oferta?", "precio especial", "regalo"],
  sistema: ["sistema", "como funciona", "para que sirve", "que es esto", "como usar", "como busco"],
  ayuda: ["ayuda", "necesito ayuda", "no entiendo", "me pueden ayudar", "ayudame", "no sé qué elegir"],
  horarios: [
    "horario", "a que hora abren", "a que hora cierran", "horas de atencion",
    "hasta que hora atienden", "atencion", "cuando abren", "fin de semana", "están abiertos"
  ],
  despedidas: ["gracias", "adios", "hasta luego", "chao", "graciar", "vuelvo luego", "listo", "eso era todo"],
  contacto: [
    "contacto", "hablar con alguien", "quiero un humano", "agente", "personal",
    "tecnico", "vendedor", "atencion personalizada", "quiero hablar con un asistente",
    "necesito ayuda real", "quiero un agente", "hablar con un experto", "quiero un asesor"
  ]
};

// Respuestas personalizadas, cálidas y con estilo
const RESPUESTAS = {
  saludos: "¡Hola! 👋 Soy <b>Racing Bot</b>, tu asistente de <b>Auto Boutique Racing Car</b>. ¿En qué puedo ayudarte hoy? 😊",
  productos: "✨ Tenemos una gran variedad de productos para mejorar tu auto: <br>• Filtros de aire y aceite<br>• Cobertores premium<br>• Luces LED y faros<br>• Balatas de alta resistencia<br>• Cámaras retro con visión nocturna<br>• Manijas y trabas eléctricas<br>• Bujías de encendido<br>• Autorradios con Bluetooth<br><br>¿Te interesa algo en especial? 🚗💡",
  luces: "¡Sí! 💡 Tenemos faros LED de alta potencia y bajo consumo. Ideales para mejorar tu visibilidad nocturna y darle un estilo moderno a tu auto. ¿Quieres que te envíe info o te conecto con un agente?",
  balatas: "Tenemos balatas de alto rendimiento para frenado seguro y duradero. Disponibles para la mayoría de modelos. ¿Sabes el modelo de tu auto? Te ayudo a elegir.",
  autorradios: "¡Claro! 🎶 Tenemos autorradios con pantalla táctil, Bluetooth, cámara retro y Android Auto. Perfectos para escuchar música y navegar con comodidad. ¿Quieres uno con GPS?",
  camaras: "¡Sí! Nuestras cámaras retro con visión nocturna te ayudan a estacionar con total seguridad. Muchas incluyen pantalla. ¿Te interesa uno para tu modelo?",
  manijas: "Tenemos manijas eléctricas y decorativas resistentes. Ideales para modernizar tus puertas. ¿Buscas para delanteras o traseras?",
  trabas: "Nuestras trabas eléctricas son seguras, fáciles de instalar y vienen con control remoto. ¿Quieres mejorar la seguridad de tu auto? 🔐",
  bujias: "Tenemos bujías de iridio y platino para mejor encendido y ahorro de combustible. ¿Sabes el tipo que necesita tu auto? Puedo ayudarte a encontrarlo.",
  filtros: "Filtros de aire, aceite y combustible de marcas confiables. Mantienen tu motor en perfecto estado. ¿Para qué modelo es?",
  cobertores: "Tenemos cobertores impermeables y con forro interior para proteger tu auto del polvo, sol y lluvia. ¿Buscas para exterior o interior?",
  mejoras: "Claro 👍 Para mejorar tu auto, te recomiendo: <br>• <b>Luces LED</b>: más seguridad y estilo<br>• <b>Cámara retro</b>: para estacionar fácil<br>• <b>Autorradio moderno</b>: con Bluetooth y pantalla<br><br>¿Qué te interesa más? 🚘",
  ofertas: "🎉 ¡Tenemos ofertas imperdibles!<br>• <b>50% de descuento en faros LED</b><br>• <b>Kit de limpieza GRATIS</b> en compras mayores a S/500<br><br>¿Te interesa aprovechar alguna?",
  sistema: "Este sistema te permite consultar productos, ver promociones y chatear con un agente si necesitas ayuda personalizada. ¡Todo en un solo lugar! 🖥️",
  ayuda: "Puedo ayudarte a encontrar productos, mostrarte ofertas o conectarte con un agente. Solo dime qué necesitas. Estoy aquí para ti. 😊",
  horarios: "Atendemos de <b>lunes a sábado de 9:00 AM a 7:00 PM</b>. Puedes visitarnos o escribirnos por WhatsApp en ese horario. 🕘",
  despedidas: "¡De nada! 😊 Si necesitas algo más, aquí estaré. ¡Que tengas un excelente día y que tu auto siempre ande impecable! 🚗💨",
  contacto: "Perfecto, te voy a conectar con un agente en vivo. Un momento... 🚀"
};

// Detectar si el mensaje contiene alguna palabra clave
function incluyePalabra(texto, palabras) {
  const lower = texto.toLowerCase();
  return palabras.some(palabra => lower.includes(palabra));
}

// Buscar intención en el mensaje del usuario
function obtenerRespuesta(mensaje) {
  const lower = mensaje.toLowerCase();

  // Buscar en cada categoría
  for (const [categoria, palabras] of Object.entries(BASE_RESPUESTAS)) {
    if (incluyePalabra(lower, palabras)) {
      return RESPUESTAS[categoria];
    }
  }

  // Respuesta por defecto, amable y orientadora
  return "Lo siento, no entendí tu pregunta. 😅<br>Puedes preguntarme cosas como:<br>• ¿Qué productos tienen?<br>• ¿Tienen faros LED?<br>• ¿A qué hora cierran?<br>• Quiero hablar con un agente";
}

// Variables globales
let chatbotBtn, chatbotWindow, chatbotMessages, chatbotInput;

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  chatbotBtn = document.querySelector('button[title="ChatBot"]');
  chatbotWindow = document.getElementById("chatbot-window");
  chatbotMessages = document.getElementById("chatbot-messages");
  chatbotInput = document.getElementById("chatbot-input");

  if (!chatbotBtn || !chatbotWindow) {
    console.warn("Botón o ventana del chatbot no encontrados.");
    return;
  }

  // Abrir/cerrar chat
  chatbotBtn.addEventListener("click", toggleChat);

  // Botón de enviar
  document.querySelector("#chatbot-window .btn-primary")?.addEventListener("click", enviarMensaje);

  // Enter en el input
  chatbotInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensaje();
  });
});

// Alternar visibilidad del chat
function toggleChat() {
  const isHidden = chatbotWindow.style.display === "none";
  chatbotWindow.style.display = isHidden ? "block" : "none";

  // Mensaje inicial al abrir
  if (isHidden && chatbotMessages.children.length <= 1) {
    setTimeout(() => {
      addBotMessage("¡Hola! 👋 Soy <b>Racing Bot</b>, tu asistente de <b>Auto Boutique Racing Car</b>. ¿En qué puedo ayudarte?");
    }, 300);
  }
}

// Enviar mensaje del usuario
function enviarMensaje() {
  const mensaje = chatbotInput.value.trim();
  if (!mensaje) return;

  // Mostrar mensaje del usuario
  addMessage(`<b>Tú:</b> ${mensaje}`, "text-end text-secondary");
  chatbotInput.value = "";

  // Detectar si quiere hablar con un humano
  if (incluyePalabra(mensaje.toLowerCase(), BASE_RESPUESTAS.contacto)) {
    setTimeout(() => {
      addBotMessage("¡Perfecto! 🚀 Te redirijo con un agente por WhatsApp para que te atienda personalmente.");
      setTimeout(() => {
        window.open("https://wa.me/981257739", "_blank"); // ✅ Número corregido
      }, 1200);
    }, 600);
    return;
  }

  // Buscar respuesta según intención
  const respuesta = obtenerRespuesta(mensaje);
  setTimeout(() => addBotMessage(respuesta), 600);
}

// Añadir mensaje del bot
function addBotMessage(text) {
  addMessage(`<b>Racing Bot:</b> ${text}`, "text-primary");
}

// Añadir mensaje al chat con scroll automático
function addMessage(html, className = "") {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = textToLinks(html); // Convierte URLs a enlaces
  msgDiv.className = className;
  msgDiv.style.margin = "0.5rem 0";
  msgDiv.style.fontSize = "0.9rem";
  msgDiv.style.lineHeight = "1.4";
  msgDiv.style.wordBreak = "break-word";
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Opcional: convertir URLs a enlaces automáticamente
function textToLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-success">${url}</a>`);
}