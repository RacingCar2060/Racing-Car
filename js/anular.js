// Datos estáticos (compartidos con otras páginas)
let productos = [
  { id: 'p1', nombre: 'Focos H11 LED', precio: 70, stock: 34 },
  { id: 'p2', nombre: 'Balatas Premium', precio: 120, stock: 25 },
  { id: 'p3', nombre: 'Filtro de Aire', precio: 45, stock: 2 },
  { id: 'p4', nombre: 'Aceite Sintético', precio: 80, stock: 20 },
  { id: 'p5', nombre: 'Manija Externa', precio: 80, stock: 15 }
];

let compras = [
  {
    id: 'C1001',
    fecha: '2025-03-05',
    proveedor: { razonSocial: 'AutoParts S.A.C.' },
    productos: [
      { id: 'p1', nombre: 'Focos H11 LED', cantidad: 3, precio: 70 },
      { id: 'p3', nombre: 'Filtro de Aire', cantidad: 2, precio: 45 }
    ],
    total: 300,
    estado: 'Activo'
  },
  {
    id: 'C1002',
    fecha: '2025-03-12',
    proveedor: { razonSocial: 'Repuestos Totales E.I.R.L.' },
    productos: [
      { id: 'p2', nombre: 'Balatas Premium', cantidad: 5, precio: 120 },
      { id: 'p4', nombre: 'Aceite Sintético', cantidad: 3, precio: 80 }
    ],
    total: 840,
    estado: 'Activo'
  },
  {
    id: 'C1003',
    fecha: '2025-03-18',
    proveedor: { razonSocial: 'ElectroCar E.I.R.L.' },
    productos: [
      { id: 'p5', nombre: 'Manija Externa', cantidad: 2, precio: 80 }
    ],
    total: 160,
    estado: 'Activo'
  }
];

// Variables globales
let compraSeleccionada = null;

// Referencias del DOM
const comprasBody = document.getElementById('comprasBody');
const successAlert = document.getElementById('successAlert');
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
const confirmarAnulacionBtn = document.getElementById('confirmarAnulacionBtn');

// Mostrar compras
function mostrarCompras() {
  comprasBody.innerHTML = '';
  compras.forEach(compra => {
    const tr = document.createElement('tr');

    const proveedorNombre = typeof compra.proveedor === 'object' ? compra.proveedor.razonSocial : compra.proveedor;
    const estadoClase = compra.estado === 'Anulado' ? 'badge-anulado' : 'badge-activo';

    tr.innerHTML = `
      <td>${compra.id}</td>
      <td>${compra.fecha}</td>
      <td>${proveedorNombre}</td>
      <td>S/ ${compra.total.toFixed(2)}</td>
      <td><span class="badge ${estadoClase}">${compra.estado}</span></td>
      <td>
        ${compra.estado === 'Activo' 
          ? `<button class="btn-anular btn-anular-compra" data-id="${compra.id}">Anular</button>` 
          : `<span class="text-muted">Anulado</span>`
        }
      </td>
    `;
    comprasBody.appendChild(tr);
  });

  // Asignar eventos a botones "Anular"
  document.querySelectorAll('.btn-anular-compra').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      compraSeleccionada = compras.find(c => c.id === id);
      if (compraSeleccionada) {
        confirmModal.show();
      }
    });
  });
}

// Confirmar anulación
confirmarAnulacionBtn.addEventListener('click', () => {
  if (!compraSeleccionada) return;

  // Validar que no esté ya anulada
  if (compraSeleccionada.estado === 'Anulado') {
    alert('Esta compra ya ha sido anulada.');
    confirmModal.hide();
    return;
  }

  // Actualizar estado
  compraSeleccionada.estado = 'Anulado';

  // Ajustar stock: restar cantidades
  compraSeleccionada.productos.forEach(item => {
    const producto = productos.find(p => p.id === item.id);
    if (producto) {
      producto.stock -= item.cantidad;
      // Evitar stock negativo
      if (producto.stock < 0) producto.stock = 0;
    }
  });

  // Mostrar mensaje de éxito
  successAlert.classList.remove('d-none');
  successAlert.classList.add('show');

  // Actualizar tabla
  mostrarCompras();

  // Cerrar modal
  confirmModal.hide();
});

// Inicializar
window.onload = () => {
  mostrarCompras();
};