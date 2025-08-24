// ======================
// 🔹 NO importamos Firebase aquí porque ya está en el HTML
// ======================

// 🔹 Variables globales
let productos = [];
let categorias = [];
let productoSeleccionado = null;
let categoriaSeleccionada = "todos";

// ======================
// 🔹 CARGAR DATOS DE FIRESTORE
// ======================
async function cargarProductos() {
  productos = [];
  try {
    const querySnapshot = await window.getDocs(window.collection(window.db, "productos"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      productos.push({
        id: doc.id,
        nombre: data.nombre,
        precio: data.precio,
        descripcion: data.descripcion || "Sin descripción",
        imagenurl: data.imagenurl,
        categoria: data.categoria,
        stock: data.stock || 0
      });
    });
    mostrarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

async function cargarCategorias() {
  categorias = [];
  try {
    const querySnapshot = await window.getDocs(window.collection(window.db, "categorias"));
    querySnapshot.forEach((doc) => {
      categorias.push({ id: doc.id, ...doc.data() });
    });

    const filtroContenedor = document.getElementById("filtroCategorias");
    filtroContenedor.innerHTML = `
      <li class="list-group-item active" onclick="filtrarPorCategoria('todos')">Todos</li>
    `;
    categorias.forEach((cat) => {
      filtroContenedor.innerHTML += `
        <li class="list-group-item" onclick="filtrarPorCategoria('${cat.id}')">
          ${cat.nombre}
        </li>
      `;
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

// ======================
function mostrarProductos() {
  const contenedores = document.getElementById("productos");
  if (!contenedores) return;
  contenedores.innerHTML = "";

  const textoBusqueda = (document.getElementById("busqueda")?.value || "").toLowerCase();

  // Filtrar por búsqueda y categoría
  let productosFiltrados = productos.filter((prod) => {
    const coincideCategoria = categoriaSeleccionada === "todos" || prod.categoria === categoriaSeleccionada;
    const coincideBusqueda =
      !textoBusqueda ||
      prod.nombre.toLowerCase().includes(textoBusqueda) ||
      (prod.descripcion && prod.descripcion.toLowerCase().includes(textoBusqueda));
    return coincideCategoria && coincideBusqueda;
  });

  // 🔹 SI ES LA PRIMERA CARGA (Todos + sin búsqueda), LIMITAR A 6
  if (categoriaSeleccionada === "todos" && !textoBusqueda) {
    productosFiltrados = productosFiltrados.slice(0, 6);
  }

  if (productosFiltrados.length === 0) {
    contenedores.innerHTML = `<div class="col-12 text-center text-muted py-4">
      <i class="bi bi-search fs-1"></i>
      <p>No se encontraron productos.</p>
    </div>`;
    return;
  }

  productosFiltrados.forEach((prod) => {
    const stockClass = prod.stock <= 0 ? "text-danger" : prod.stock <= 5 ? "text-warning" : "text-success";
    const stockText = prod.stock <= 0 ? "Agotado" : `Stock: ${prod.stock}`;

    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-light producto-card">
        <img src="${prod.imagenurl}" class="card-img-top" alt="${prod.nombre}" style="height: 180px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-dark fw-bold">${prod.nombre}</h5>
          <p class="card-text text-success fs-5 fw-bold mb-1">S/ ${parseFloat(prod.precio).toFixed(2)}</p>
          <p class="card-text ${stockClass} small mb-2">
            <i class="bi bi-box"></i> ${stockText}
          </p>
         
          <button class="btn btn-outline-primary mb-2" onclick="verDetalle('${prod.id}')">
            <i class="bi bi-eye"></i> Ver detalles
          </button>
          <button class="btn btn-success" onclick="agregarAlCarrito('${prod.id}')" ${prod.stock <= 0 ? 'disabled' : ''}>
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    contenedores.appendChild(col);
  });
}


// ======================
// 🔹 VER DETALLES
// ======================
function verDetalle(id) {
  const prod = productos.find(p => p.id === id);
  if (!prod) {
    alert("Producto no encontrado");
    return;
  }

  productoSeleccionado = prod;

  document.getElementById("detalleNombre").textContent = prod.nombre;
  document.getElementById("detalleDescripcion").textContent = prod.descripcion;
  document.getElementById("detallePrecio").textContent = `Precio: S/ ${parseFloat(prod.precio).toFixed(2)}`;
  document.getElementById("detalleImagen").src = prod.imagenurl;
  document.getElementById("detalleImagen").alt = prod.nombre;

  const stockText = prod.stock <= 0 ? "🔴 Agotado" : `🟢 ${prod.stock} unidades disponibles`;
  const stockClass = prod.stock <= 0 ? "text-danger fw-bold" : "text-success";
  document.getElementById("detalleStock").className = stockClass;
  document.getElementById("detalleStock").textContent = stockText;

  const btnAgregar = document.getElementById("btnAgregarModal");
  if (prod.stock <= 0) {
    btnAgregar.disabled = true;
    btnAgregar.innerHTML = '<i class="bi bi-ban"></i> Sin stock';
  } else {
    btnAgregar.disabled = false;
    btnAgregar.innerHTML = '<i class="bi bi-cart-plus"></i> Agregar al carrito';
  }

  const modal = new bootstrap.Modal(document.getElementById("detalleModal"));
  modal.show();
}

// ======================
// 🔹 AGREGAR AL CARRITO
// ======================
function agregarAlCarrito(id = null) {
  let prod = null;

  if (id) {
    prod = productos.find(p => p.id === id);
  } else if (productoSeleccionado) {
    prod = productoSeleccionado;
  }

  if (!prod || prod.stock <= 0) {
    alert("No hay stock disponible para este producto.");
    return;
  }

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex(item => item.id === prod.id);

  if (index > -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${prod.nombre} agregado al carrito.`);
  actualizarContadorCarrito();
}

// ======================
// 🔹 ACTUALIZAR CONTADOR DEL CARRITO
// ======================
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const contador = document.getElementById("cart-count");
  if (contador) contador.textContent = total;
}

// ======================
// 🔹 FILTRAR POR CATEGORÍA
// ======================
function filtrarPorCategoria(idCategoria) {
  categoriaSeleccionada = idCategoria;

  document.querySelectorAll("#filtroCategorias .list-group-item").forEach(item => {
    item.classList.remove("active");
  });

  const items = document.querySelectorAll("#filtroCategorias .list-group-item");
  for (let item of items) {
    const text = item.textContent.trim();
    if (idCategoria === "todos" && text === "Todos") {
      item.classList.add("active");
      break;
    }
    const cat = categorias.find(c => c.id === idCategoria);
    if (cat && text === cat.nombre) {
      item.classList.add("active");
      break;
    }
  }

  mostrarProductos();
}

// ======================
// 🔹 INICIALIZAR APP
// ======================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await cargarCategorias();
    await cargarProductos();
    actualizarContadorCarrito();

    const inputBusqueda = document.getElementById("busqueda");
    if (inputBusqueda) {
      inputBusqueda.addEventListener("input", mostrarProductos);
    }
  } catch (error) {
    console.error("Error al cargar la app:", error);
  }
});

// 🔹 Hacer funciones globales
window.verDetalle = verDetalle;
window.agregarAlCarrito = agregarAlCarrito;
window.filtrarPorCategoria = filtrarPorCategoria;