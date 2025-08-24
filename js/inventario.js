// Configuración de Firebase
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Referencias del DOM
const inventarioBody = document.getElementById("inventarioBody");
const searchInput = document.getElementById("searchInput");
const totalProductos = document.getElementById("totalProductos");
const enStock = document.getElementById("enStock");
const stockBajo = document.getElementById("stockBajo");
const agotados = document.getElementById("agotados");

let productos = [];

// Verificar autenticación
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const userDocRef = db.collection('usuarios').doc(user.uid);
  userDocRef.get()
    .then(doc => {
      if (!doc.exists || doc.data().rol !== "admin") {
        alert("Acceso denegado.");
        window.location.href = 'index.html';
        return;
      }
      // Cargar productos desde Firebase
      loadProductos();
    })
    .catch(() => window.location.href = 'login.html');
});

// Cargar productos desde Firebase
function loadProductos() {
  db.collection('productos').onSnapshot(snapshot => {
    productos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      productos.push({
        id: doc.id,
        nombre: data.nombre,
        precio: data.precio,
        categoria: data.categoria || 'Sin categoría',
        stock: data.stock || 0,
        imagen: data.imagenurl || '../img/default.jpg'  // usa imagenurl de Firebase
      });
    });
    filtrarYMostrar();
    actualizarEstadisticas();
  }, err => {
    console.error("Error al cargar productos:", err);
    inventarioBody.innerHTML = `
      <tr><td colspan="6" class="text-center text-danger">Error al cargar datos</td></tr>
    `;
  });
}

// Filtrar y mostrar productos
function filtrarYMostrar() {
  const term = searchInput.value.toLowerCase();
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(term));
  inventarioBody.innerHTML = '';

  if (filtrados.length === 0) {
    inventarioBody.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted">No se encontraron productos</td></tr>
    `;
    return;
  }

  filtrados.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id.slice(0,6)}</td>
      <td>${p.nombre}</td>
      <td>S/ ${p.precio.toFixed(2)}</td>
      <td><span class="badge bg-secondary">${p.categoria}</span></td>
      <td class="${p.stock === 0 ? 'stock-low' : p.stock <= 5 ? 'stock-low' : 'stock-ok'}">
        ${p.stock === 0 ? 'Agotado' : p.stock}
      </td>
      <td><img src="${p.imagen}" width="50" alt="${p.nombre}" class="img-fluid rounded"></td>
    `;
    inventarioBody.appendChild(tr);
  });
}

// Actualizar estadísticas
function actualizarEstadisticas() {
  const total = productos.length;
  const conStock = productos.filter(p => p.stock > 0).length;
  const bajo = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
  const cero = productos.filter(p => p.stock === 0).length;

  totalProductos.textContent = total;
  enStock.textContent = conStock;
  stockBajo.textContent = bajo;
  agotados.textContent = cero;
}

// Buscador en tiempo real
searchInput.addEventListener("input", filtrarYMostrar);