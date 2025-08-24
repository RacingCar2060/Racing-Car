import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Evento de login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 🔹 1. Autenticación
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔹 2. Buscar datos en Firestore por correo
    const q = query(collection(db, "usuarios"), where("correo", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();

      console.log("Usuario:", userData.nombre);
      console.log("Rol:", userData.rol);

      // 🔹 3. Redirección según rol
      if (userData.rol === "admin") {
        window.location.href = "inventario.html";
      } else {
        window.location.href = "../index.html";
      }
    } else {
      document.getElementById("errorMsg").textContent =
        "No se encontró información del usuario en Firestore.";
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error.code, error.message);
    document.getElementById("errorMsg").textContent = "Error: " + error.message;
  }
});
