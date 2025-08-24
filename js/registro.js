// registro.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// 🔹 Configuración de Firebase (tu misma del login)
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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capturar valores
    const name = document.getElementById("inputName").value.trim();
    const email = document.getElementById("inputEmailReg").value.trim();
    const password = document.getElementById("inputPasswordReg").value;
    const confirmPassword = document.getElementById("inputPasswordConfirm").value;

    // Validaciones
    if (!name) return alert("El nombre es obligatorio");
    if (!email) return alert("El correo es obligatorio");
    if (password.length < 8) return alert("La contraseña debe tener al menos 8 caracteres");
    if (password !== confirmPassword) return alert("Las contraseñas no coinciden");

    try {
      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: name,
        correo: email,
        rol: email === "admin@autoboutique.com" ? "admin" : "usu",
        creado: new Date().toISOString()
      });

      // 3. Mensaje de éxito
      successMessage.classList.remove("d-none");
      form.classList.add("d-none");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);

    } catch (error) {
      console.error("❌ Error en registro:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("Este correo ya está en uso.");
      } else {
        alert("Error en el registro: " + error.message);
      }
    }
  });
});
