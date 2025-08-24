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

// Elementos del DOM
const stockTableBody = document.getElementById('stockTableBody');
const categoryFilter = document.getElementById('categoryFilter');
const sortStockBtn = document.getElementById('sortStockBtn');
const message = document.getElementById('message');

let productos = [];
let categoriasUnicas = new Set();
let ordenActual = 1; // 1: ascendente, -1: descendente

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
      // ✅ Es admin → cargar stock
      message.classList.remove('hidden');
      message.textContent = "Cargando productos...";
      loadStock();
    })
    .catch(() => {
      window.location.href = 'login.html';
    });
});

// Cargar stock desde Firebase
function loadStock() {
  db.collection('productos').onSnapshot(snapshot => {
    productos = [];
    categoriasUnicas = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      const producto = {
        id: doc.id,
        nombre: data.nombre,
        categoria: data.categoria || 'Sin categoría',
        stock: data.stock || 0
      };
      productos.push(producto);
      categoriasUnicas.add(producto.categoria);
    });

    // Llenar filtro de categorías
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
    categoriasUnicas.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    // Mostrar productos
    filterAndDisplay();
    message.classList.add('hidden');
  }, err => {
    console.error("Error al cargar productos:", err);
    message.classList.remove('hidden');
    message.textContent = "Lo sentimos, parece que hubo un error al recuperar los datos.";
  });
}

// Filtrar y mostrar productos
function filterAndDisplay() {
  const filtroCategoria = categoryFilter.value;
  const orden = ordenActual;

  let filtered = productos;

  if (filtroCategoria) {
    filtered = productos.filter(p => p.categoria === filtroCategoria);
  }

  // Ordenar por stock
  filtered.sort((a, b) => (a.stock - b.stock) * orden);

  // Limpiar tabla
  stockTableBody.innerHTML = '';

  if (filtered.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3" style="text-align:center; color:#7f8c8d;">No hay productos disponibles</td>';
    stockTableBody.appendChild(tr);
    return;
  }

  filtered.forEach(prod => {
    const tr = document.createElement('tr');

    // Clase según stock
    let stockClass = 'stock-ok';
    let stockText = prod.stock;
    if (prod.stock === 0) {
      stockClass = 'stock-agotado';
      stockText = 'AGOTADO';
    } else if (prod.stock <= 5) {
      stockClass = 'stock-bajo';
    }

    tr.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td class="${stockClass}">${stockText}</td>
    `;
    stockTableBody.appendChild(tr);
  });
}

// Eventos
categoryFilter.addEventListener('change', filterAndDisplay);

sortStockBtn.addEventListener('click', () => {
  ordenActual *= -1;
  sortStockBtn.textContent = 
    ordenActual === 1 ? 'Ordenar por Stock ↑' : 'Ordenar por Stock ↓';
  filterAndDisplay();
});

// Carga inicial
window.onload = () => {
  // El onAuthStateChanged ya maneja el inicio
};