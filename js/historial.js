// Datos estáticos simulados (puedes copiar de compras.js si usas los mismos)
let compras = [
  {
    id: 'C1001',
    fecha: '2025-03-05',
    proveedor: { razonSocial: 'AutoParts S.A.C.' },
    productos: [
      { nombre: 'Focos H11 LED', cantidad: 3, precio: 70 },
      { nombre: 'Filtro de Aire', cantidad: 2, precio: 45 }
    ],
    total: 300
  },
  {
    id: 'C1002',
    fecha: '2025-03-12',
    proveedor: { razonSocial: 'Repuestos Totales E.I.R.L.' },
    productos: [
      { nombre: 'Balatas Premium', cantidad: 5, precio: 120 },
      { nombre: 'Aceite Sintético', cantidad: 3, precio: 80 }
    ],
    total: 840
  },
  {
    id: 'C1003',
    fecha: '2025-03-18',
    proveedor: 'AutoParts S.A.C.',
    productos: [
      { nombre: 'Manija Externa', cantidad: 2, precio: 80 }
    ],
    total: 160
  },
  {
    id: 'C1004',
    fecha: '2025-03-25',
    proveedor: { razonSocial: 'ElectroCar E.I.R.L.' },
    productos: [
      { nombre: 'Aceite Sintético', cantidad: 4, precio: 80 }
    ],
    total: 320
  }
];

// Referencias del DOM
const filtroTipo = document.getElementById('filtroTipo');
const filtroProveedorGroup = document.getElementById('filtroProveedorGroup');
const filtroFechaGroup = document.getElementById('filtroFechaGroup');
const filtroSerieGroup = document.getElementById('filtroSerieGroup');
const filtroProveedor = document.getElementById('filtroProveedor');
const filtroFecha = document.getElementById('filtroFecha');
const filtroSerie = document.getElementById('filtroSerie');
const historialBody = document.getElementById('historialBody');
const noResults = document.getElementById('noResults');

// Llenar select de proveedores
function llenarProveedores() {
  const proveedores = [...new Set(compras.map(c => typeof c.proveedor === 'object' ? c.proveedor.razonSocial : c.proveedor))];
  filtroProveedor.innerHTML = '<option value="">Todos los proveedores</option>';
  proveedores.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    filtroProveedor.appendChild(option);
  });
}

// Mostrar/Ocultar filtros según selección
filtroTipo.addEventListener('change', () => {
  filtroProveedorGroup.classList.add('d-none');
  filtroFechaGroup.classList.add('d-none');
  filtroSerieGroup.classList.add('d-none');

  if (filtroTipo.value === 'proveedor') {
    filtroProveedorGroup.classList.remove('d-none');
  } else if (filtroTipo.value === 'fecha') {
    filtroFechaGroup.classList.remove('d-none');
  } else if (filtroTipo.value === 'serie') {
    filtroSerieGroup.classList.remove('d-none');
  }

  aplicarFiltro();
});

// Aplicar filtro
function aplicarFiltro() {
  const tipo = filtroTipo.value;

  let resultados = [...compras];

  if (tipo === 'proveedor') {
    const valor = filtroProveedor.value;
    if (valor) {
      resultados = resultados.filter(c => {
        const nombreProv = typeof c.proveedor === 'object' ? c.proveedor.razonSocial : c.proveedor;
        return nombreProv === valor;
      });
    }
  } else if (tipo === 'fecha') {
    const valor = filtroFecha.value;
    if (valor) {
      resultados = resultados.filter(c => c.fecha === valor);
    }
  } else if (tipo === 'serie') {
    const valor = filtroSerie.value.trim().toLowerCase();
    if (valor) {
      resultados = resultados.filter(c => c.id.toLowerCase().includes(valor));
    }
  }

  // Mostrar resultados
  historialBody.innerHTML = '';
  if (resultados.length === 0) {
    noResults.classList.remove('d-none');
  } else {
    noResults.classList.add('d-none');
    resultados.forEach(c => {
      const tr = document.createElement('tr');
      const proveedorNombre = typeof c.proveedor === 'object' ? c.proveedor.razonSocial : c.proveedor;
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.fecha}</td>
        <td>${proveedorNombre}</td>
        <td>${c.productos.length}</td>
        <td class="text-success fw-bold">S/ ${c.total.toFixed(2)}</td>
      `;
      historialBody.appendChild(tr);
    });
  }
}

// Eventos de filtros
[filtroProveedor, filtroFecha, filtroSerie].forEach(input => {
  if (input) {
    input.addEventListener('input', aplicarFiltro);
  }
});

// Inicializar
window.onload = () => {
  llenarProveedores();
  aplicarFiltro(); // Mostrar todos al inicio
};