// =============================
// RECUPERAR CONTRASEÑA
// =============================

// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// 🔹 Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEKgW__Gfy9U3fOVzEOqyXgY682FYA3VU",
  authDomain: "autoboutique-racing-car.firebaseapp.com",
  projectId: "autoboutique-racing-car",
  storageBucket: "autoboutique-racing-car.firebasestorage.app",
  messagingSenderId: "573057463212",
  appId: "1:573057463212:web:973e8fe6b87d2180d84009",
  measurementId: "G-26FMZFW2TX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const formRecuperar = document.getElementById("recuperar-form");
  const emailInput = document.getElementById("email");
  const mensajeDiv = document.createElement("div");
  mensajeDiv.id = "mensaje";
  formRecuperar.appendChild(mensajeDiv);

  // Evento submit
  formRecuperar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {
      mostrarMensaje("⚠️ Por favor ingresa tu correo electrónico.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      mostrarMensaje(
        "📧 Se envió un enlace de recuperación a tu correo registrado.",
        "success"
      );
      formRecuperar.reset();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        mostrarMensaje("❌ El correo no está registrado.", "error");
      } else if (error.code === "auth/invalid-email") {
        mostrarMensaje("⚠️ El formato del correo no es válido.", "error");
      } else {
        mostrarMensaje("❌ Ocurrió un error. Intenta nuevamente.", "error");
        console.error("Error:", error.message);
      }
    }
  });

  // Función para mostrar mensajes dinámicos
  function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = tipo === "success" ? "mensaje exito" : "mensaje error";

    // Desaparece en 5 segundos
    setTimeout(() => {
      mensajeDiv.textContent = "";
      mensajeDiv.className = "";
    }, 5000);
  }
});
