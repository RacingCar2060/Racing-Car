// Datos estáticos
let productos = [
  { id: 'p1', nombre: 'Focos H11 LED', precio: 70, stock: 34 },
  { id: 'p2', nombre: 'Balatas Premium', precio: 120, stock: 25 },
  { id: 'p3', nombre: 'Filtro de Aire', precio: 45, stock: 2 },
  { id: 'p4', nombre: 'Aceite Sintético', precio: 80, stock: 20 },
  { id: 'p5', nombre: 'Manija Externa', precio: 80, stock: 15 }
];

let proveedores = [
  { ruc: '20123456789', razonSocial: 'AutoParts S.A.C.', direccion: 'Av. Principal 123' },
  { ruc: '20987654321', razonSocial: 'Repuestos Totales E.I.R.L.', direccion: 'Calle Falsa 456' }
];

let compras = []; // Historial de compras (simulado)

// Referencias del DOM
const compraForm = document.getElementById('compraForm');
const fechaCompra = document.getElementById('fechaCompra');
const proveedorSelect = document.getElementById('proveedorSelect');
const nuevoProveedorForm = document.getElementById('nuevoProveedorForm');
const ruc = document.getElementById('ruc');
const razonSocial = document.getElementById('razonSocial');
const direccion = document.getElementById('direccion');
const productosBody = document.getElementById('productosBody');
const agregarProductoBtn = document.getElementById('agregarProductoBtn');
const successAlert = document.getElementById('successAlert');

// Modal
const productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
const productoSelect = document.getElementById('productoSelect');
const seleccionarProductoBtn = document.getElementById('seleccionarProductoBtn');

// Inicializar
window.onload = () => {
  const hoy = new Date().toISOString().split('T')[0];
  fechaCompra.value = hoy;
  llenarProveedoresSelect();
};

// Llenar select de productos
function llenarProductosSelect() {
  productoSelect.innerHTML = '';
  productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.nombre} - S/ ${p.precio}`;
    productoSelect.appendChild(option);
  });
}

// Llenar select de proveedores
function llenarProveedoresSelect() {
  proveedorSelect.innerHTML = '<option value="">Seleccionar proveedor</option><option value="nuevo">+ Registrar nuevo proveedor</option>';
  proveedores.forEach(p => {
    const option = document.createElement('option');
    option.value = p.ruc;
    option.textContent = p.razonSocial;
    proveedorSelect.appendChild(option);
  });
}

// Mostrar/ocultar formulario de nuevo proveedor
proveedorSelect.addEventListener('change', () => {
  if (proveedorSelect.value === 'nuevo') {
    nuevoProveedorForm.classList.remove('d-none');
  } else {
    nuevoProveedorForm.classList.add('d-none');
  }
});

// Agregar producto
agregarProductoBtn.addEventListener('click', () => {
  llenarProductosSelect();
  productoModal.show();
});

seleccionarProductoBtn.addEventListener('click', () => {
  const id = productoSelect.value;
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const tr = document.createElement('tr');
  tr.dataset.id = producto.id;
  tr.innerHTML = `
    <td>${producto.nombre}</td>
    <td><input type="number" class="form-control cantidad" value="1" min="1"></td>
    <td><input type="number" class="form-control precio" value="${producto.precio}" min="0" step="0.01"></td>
    <td class="total">S/ ${producto.precio.toFixed(2)}</td>
    <td><button class="btn btn-danger btn-sm eliminar"><i class="fas fa-trash"></i></button></td>
  `;
  productosBody.appendChild(tr);

  // Actualizar total
  tr.querySelectorAll('.cantidad, .precio').forEach(input => {
    input.addEventListener('input', () => {
      const cantidad = parseFloat(tr.querySelector('.cantidad').value) || 0;
      const precio = parseFloat(tr.querySelector('.precio').value) || 0;
      tr.querySelector('.total').textContent = `S/ ${(cantidad * precio).toFixed(2)}`;
    });
  });

  productoModal.hide();
});

// Eliminar producto
productosBody.addEventListener('click', (e) => {
  if (e.target.closest('.eliminar')) {
    e.target.closest('tr').remove();
  }
});

// Validar y guardar compra
compraForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const fecha = fechaCompra.value;
  const hoy = new Date().toISOString().split('T')[0];
  if (!fecha || fecha > hoy) {
    alert('La fecha no puede ser posterior a hoy.');
    return;
  }

  const proveedorRuc = proveedorSelect.value;
  let proveedor;

  if (proveedorRuc === 'nuevo') {
    if (!ruc.value || !razonSocial.value || !direccion.value) {
      alert('Completa todos los campos del nuevo proveedor.');
      return;
    }
    proveedor = { ruc: ruc.value, razonSocial: razonSocial.value, direccion: direccion.value };
    proveedores.push(proveedor);
    llenarProveedoresSelect(); // Actualizar lista
  } else {
    proveedor = proveedores.find(p => p.ruc === proveedorRuc);
  }

  const productosCompra = [];
  let isValid = true;

  Array.from(productosBody.querySelectorAll('tr')).forEach(tr => {
    const id = tr.dataset.id;
    const cantidad = parseFloat(tr.querySelector('.cantidad').value);
    const precio = parseFloat(tr.querySelector('.precio').value);
    const producto = productos.find(p => p.id === id);

    if (!cantidad || !precio || isNaN(cantidad) || isNaN(precio) || cantidad <= 0) {
      isValid = false;
    }

    productosCompra.push({ ...producto, cantidad, precio });
  });

  if (!isValid) {
    alert('Verifica que todas las cantidades y precios sean válidos.');
    return;
  }

  // Simular registro
  const compra = {
    id: 'C' + Date.now(),
    fecha,
    proveedor,
    productos: productosCompra,
    total: productosCompra.reduce((sum, p) => sum + p.cantidad * p.precio, 0)
  };

  compras.push(compra);

  // Actualizar stock en productos
  productosCompra.forEach(item => {
    const prod = productos.find(p => p.id === item.id);
    if (prod) prod.stock += item.cantidad;
  });

  // Mostrar éxito
  successAlert.classList.remove('d-none');
  successAlert.classList.add('show');

  // Resetear formulario
  compraForm.reset();
  fechaCompra.value = hoy;
  productosBody.innerHTML = '';
  nuevoProveedorForm.classList.add('d-none');
});
