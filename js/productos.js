// Configuración de Firebase (tu configuración)
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

auth.onAuthStateChanged(user => {
  if (!user) {
    console.log("No hay usuario logueado");
    window.location.href = 'login.html';
    return;
  }

  console.log("✅ Usuario logueado:", user.email);
  console.log("🔑 UID:", user.uid);

  const userDocRef = db.collection('usuarios').doc(user.uid);

  userDocRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log("❌ Documento no encontrado en Firestore");
        alert("No tienes acceso. Usuario no registrado.");
        window.location.href = 'index.html';
        return;
      }

      const userData = doc.data();
      const userRole = userData.rol;

      console.log("🎯 Rol obtenido:", userRole);

      if (userRole !== "admin") {
        console.log("🚫 Acceso denegado. Rol actual:", userRole);
        alert("Acceso denegado. Solo los administradores pueden acceder.");
        window.location.href = 'index.html';
        return;
      }

      console.log("🎉 Acceso concedido como administrador");
      loadCategories();
      loadProducts();
    })
    .catch(err => {
      console.error("❌ Error al verificar rol:", err);
      alert("Error al verificar permisos. Intenta nuevamente.");
      window.location.href = 'login.html';
    });
});

// Referencias a elementos del DOM
const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const searchInput = document.getElementById('searchInput');
const cancelEditBtn = document.getElementById('cancelEdit');
const categoryIdSelect = document.getElementById('categoria');

let editingId = null;

// Cargar categorías
function loadCategories() {
  db.collection('categorias').get()
    .then(snapshot => {
      categoryIdSelect.innerHTML = '<option value="">Selecciona una categoría</option>';
      snapshot.forEach(doc => {
        const data = doc.data();
        const option = document.createElement('option');
        option.value = data.nombre;
        option.textContent = data.nombre;
        categoryIdSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Error al cargar categorías: ", err);
      alert("No se pudieron cargar las categorías.");
    });
}

// Cargar productos
function loadProducts(filter = '') {
  db.collection('productos').get()
    .then(snapshot => {
      productTableBody.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();

        // ✅ Obtener imagen del campo 'imagenurl' (minúsculas)
        const imageUrl = data.imagenurl || 'https://via.placeholder.com/150?text=Sin+Imagen';

        if (data.nombre.toLowerCase().includes(filter.toLowerCase())) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${data.nombre}</td>
            <td>${data.categoria || 'Sin categoría'}</td>
            <td>$${parseFloat(data.precio).toFixed(2)}</td>
            <td>${data.stock}</td>
            <!-- ✅ Columna de imagen -->
            <td>
              <img src="${imageUrl}" alt="Producto" width="50" style="border-radius: 4px; object-fit: cover;">
            </td>
            <td class="actions">
              <button class="edit-btn" data-id="${doc.id}">Editar</button>
              <button class="delete-btn" data-id="${doc.id}">Eliminar</button>
            </td>
          `;
          productTableBody.appendChild(tr);
        }
      });

      // Añadir eventos a botones
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editProduct(e.target.dataset.id));
      });
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteProduct(e.target.dataset.id));
      });
    })
    .catch(err => {
      console.error("Error al cargar productos: ", err);
      alert("No se pudieron cargar los productos.");
    });
}

// Buscar productos
searchInput.addEventListener('input', (e) => {
  loadProducts(e.target.value);
});

// Guardar producto (agregar o editar)
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const imagenUrl = document.getElementById('imagenUrl').value.trim(); // ID: imagenUrl
  const stock = parseInt(document.getElementById('stock').value);
  const precio = parseFloat(document.getElementById('precio').value);
  const categoria = document.getElementById('categoria').value;

  // Validaciones
  if (!nombre || isNaN(stock) || isNaN(precio) || !categoria) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  // ✅ Guardar como 'imagenurl' (minúsculas) en Firestore
  const productData = {
    nombre,
    descripcion,
    imagenurl: imagenUrl, // ✅ clave correcta
    stock,
    precio,
    categoria
  };

  if (editingId) {
    // Actualizar
    db.collection('productos').doc(editingId).update(productData)
      .then(() => {
        alert("Producto actualizado con éxito.");
        resetForm();
        loadProducts();
      })
      .catch(err => {
        if (err.message.includes('permission-denied')) {
          alert("No tienes permisos para actualizar este producto.");
        } else {
          alert("Error al actualizar producto: " + err.message);
        }
      });
  } else {
    // Verificar si ya existe
    db.collection('productos').where('nombre', '==', nombre).get()
      .then(snapshot => {
        if (!snapshot.empty) {
          alert("Ya existe un producto con ese nombre.");
          return;
        }
        // Agregar nuevo
        db.collection('productos').add(productData)
          .then(() => {
            alert("Producto agregado con éxito.");
            resetForm();
            loadProducts();
          })
          .catch(err => {
            alert("Error al agregar producto: " + err.message);
          });
      })
      .catch(err => {
        alert("Error al verificar duplicados: " + err.message);
      });
  }
});

// Editar producto
function editProduct(id) {
  db.collection('productos').doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('productId').value = id;
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('descripcion').value = data.descripcion || '';
        
        // ✅ Corregido: el input es 'imagenUrl' (con mayúscula)
        document.getElementById('imagenUrl').value = data.imagenurl || ''; // leer de 'imagenurl'
        
        document.getElementById('stock').value = data.stock;
        document.getElementById('precio').value = data.precio;
        document.getElementById('categoria').value = data.categoria;

        editingId = id;
        document.getElementById('saveBtn').textContent = 'Actualizar';
        document.getElementById('cancelEdit').style.display = 'inline-block';
      }
    })
    .catch(err => {
      alert("Error al cargar producto: " + err.message);
    });
}

// Cancelar edición
cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

// Eliminar producto
function deleteProduct(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

  db.collection('productos').doc(id).get().then(doc => {
    if (doc.exists) {
      db.collection('productos').doc(id).delete()
        .then(() => {
          alert("Producto eliminado.");
          loadProducts();
        })
        .catch(err => {
          if (err.message.includes('has dependent')) {
            alert("No se puede eliminar: el producto está en una venta. Marca como inactivo.");
          } else {
            alert("Error al eliminar: " + err.message);
          }
        });
    }
  });
}

// Resetear formulario
function resetForm() {
  productForm.reset();
  editingId = null;
  document.getElementById('saveBtn').textContent = 'Guardar';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('productId').value = '';
}

// Cargar todo al inicio
window.onload = () => {
  loadCategories();
  loadProducts();
};