// ================== DATOS ESTÁTICOS ==================
const ventas = [
  {
    fecha: new Date("2025-03-05"),
    productos: [
      { nombre: "Focos H11 LED", cantidad: 3, precio: 70 },
      { nombre: "Filtro de Aire", cantidad: 2, precio: 45 }
    ],
    total: 690
  },
  {
    fecha: new Date("2025-03-12"),
    productos: [
      { nombre: "Aceite Sintético", cantidad: 5, precio: 80 },
      { nombre: "Batería Varta", cantidad: 1, precio: 300 }
    ],
    total: 700
  },
  {
    fecha: new Date("2025-03-18"),
    productos: [
      { nombre: "Llanta Deportiva", cantidad: 2, precio: 200 },
      { nombre: "Pastillas de Freno", cantidad: 4, precio: 60 }
    ],
    total: 640
  },
  {
    fecha: new Date("2025-03-25"),
    productos: [
      { nombre: "Aceite Sintético", cantidad: 3, precio: 80 },
      { nombre: "Filtro de Aire", cantidad: 1, precio: 45 }
    ],
    total: 285
  },
  {
    fecha: new Date("2025-04-02"),
    productos: [
      { nombre: "Batería Varta", cantidad: 2, precio: 300 },
      { nombre: "Pastillas de Freno", cantidad: 3, precio: 60 }
    ],
    total: 780
  }
];

// 📦 Productos estáticos con categorías
const productos = [
  // ✅ Luces LED
  {
    nombre: "Focos H11 LED",
    descripcion: "Alta intensidad, bajo consumo.",
    precio: 70,
    stock: 34,
    categoria: "luces led",
    imagenUrl: "https://gpc.pe/cdn/shop/files/25046.png?v=1699536285"
  },
  {
    nombre: "Focos H7 LED",
    descripcion: "Ideal para faros delanteros.",
    precio: 75,
    stock: 8,
    categoria: "luces led",
    imagenUrl: "https://m.media-amazon.com/images/I/51bFvZqL1EL._AC_SL1000_.jpg"
  },

  // ✅ Faros
  {
    nombre: "Faros LED Completo",
    descripcion: "Juego de faros delanteros LED.",
    precio: 250,
    stock: 5,
    categoria: "faros",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_604327-MLM51748652289_102022-O.webp"
  },

  // ✅ Balatas
  {
    nombre: "Balatas Premium",
    descripcion: "Pastillas de freno de larga duración.",
    precio: 120,
    stock: 25,
    categoria: "balatas",
    imagenUrl: "https://www.refaccionariamario.com/media/catalog/product/cache/2/image/600x600/0dc2d03fe217f8c83829496872af24a0/b/a/balatas-premium.jpg"
  },

  // ✅ Manijas
  {
    nombre: "Manija Externa",
    descripcion: "Manija cromada de alta resistencia.",
    precio: 80,
    stock: 15,
    categoria: "manijas",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_850261-MLM74187557356_012024-O.webp"
  },
  {
    nombre: "Manija Interna",
    descripcion: "Repuesto para puertas.",
    precio: 60,
    stock: 20,
    categoria: "manijas",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_600477-MLM31056985776_062019-O.webp"
  },

  // ✅ Cámaras
  {
    nombre: "Cámara de retroceso",
    descripcion: "Cámara impermeable Full HD.",
    precio: 110,
    stock: 12,
    categoria: "camaras",
    imagenUrl: "https://m.media-amazon.com/images/I/51oNP0ZyWpL._AC_SL1000_.jpg"
  },

  // ✅ Filtros
  {
    nombre: "Filtro de Aire",
    descripcion: "Filtro de alto rendimiento.",
    precio: 45,
    stock: 2,
    categoria: "filtros",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_969587-MLM72757450200_112023-O.webp"
  },

  // ✅ Bujías
  {
    nombre: "Bujía Iridium",
    descripcion: "Encendido rápido, mayor eficiencia.",
    precio: 35,
    stock: 40,
    categoria: "bujias",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_759889-MLM52748558088_122022-O.webp"
  },

  // ✅ Autorradios
  {
    nombre: "Autorradio Android",
    descripcion: "Pantalla táctil 7 pulgadas, Bluetooth.",
    precio: 180,
    stock: 7,
    categoria: "autorradios",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_697352-MLM51557757662_092022-O.webp"
  },

  // ✅ Convertidores
  {
    nombre: "Convertidor DC-DC",
    descripcion: "Estabilizador de voltaje para LED.",
    precio: 90,
    stock: 10,
    categoria: "convertidores",
    imagenUrl: "https://m.media-amazon.com/images/I/51vLJxu2eKL._AC_SL1000_.jpg"
  },

  // ✅ Trabas
  {
    nombre: "Kit de Trabas Eléctricas",
    descripcion: "Sistema de cierre centralizado.",
    precio: 130,
    stock: 4,
    categoria: "trabagas",
    imagenUrl: "https://http2.mlstatic.com/D_NQ_NP_882771-MLM31095833044_062019-O.webp"
  }
];

// ================== REFERENCIAS DEL DOM ==================
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const categoriaFilter = document.getElementById("categoriaFilter");
const searchInput = document.getElementById("searchInput");
const filtrarBtn = document.getElementById("filtrarBtn");
const mensaje = document.getElementById("mensaje");
const ventasTableBody = document.getElementById("ventasTableBody");
const productosTableBody = document.getElementById("productosTableBody");
const exportBtn = document.getElementById("exportBtn");

// ================== GRÁFICOS ==================
let ventasChart = null;
let productosChart = null;

// ================== INICIO: Cargar datos al cargar la página ==================
window.onload = () => {
  const hoy = new Date();
  const hace30 = new Date();
  hace30.setDate(hoy.getDate() - 30);

  const formato = (date) => new Date(date).toISOString().split("T")[0];
  fechaInicio.value = formato(hace30);
  fechaFin.value = formato(hoy);

  // Cargar datos iniciales
  procesarYMostrar(ventas);
  mostrarProductos();

  // Eventos
  categoriaFilter.addEventListener("change", mostrarProductos);
  searchInput.addEventListener("input", mostrarProductos);
};

// ================== FILTRAR VENTAS POR FECHA ==================
filtrarBtn.addEventListener("click", () => {
  const inicio = new Date(fechaInicio.value);
  const fin = new Date(fechaFin.value);
  fin.setHours(23, 59, 59);

  const ventasFiltradas = ventas.filter(v => v.fecha >= inicio && v.fecha <= fin);

  if (ventasFiltradas.length === 0) {
    mensaje.classList.remove("d-none");
    clearCharts();
    ventasTableBody.innerHTML = "";
    return;
  }

  mensaje.classList.add("d-none");
  procesarYMostrar(ventasFiltradas);
});

// ================== PROCESAR Y MOSTRAR GRÁFICOS ==================
function procesarYMostrar(ventas) {
  const ventasPorQuincena = {};
  const productosVendidos = {};

  ventas.forEach(venta => {
    const mes = venta.fecha.getMonth() + 1;
    const año = venta.fecha.getFullYear();
    const dia = venta.fecha.getDate();
    const quincena = dia <= 15 ? `Q1 ${mes}/${año}` : `Q2 ${mes}/${año}`;
    ventasPorQuincena[quincena] = (ventasPorQuincena[quincena] || 0) + venta.total;

    venta.productos.forEach(prod => {
      productosVendidos[prod.nombre] = (productosVendidos[prod.nombre] || 0) + prod.cantidad;
    });
  });

  // Actualizar gráficos
  actualizarBarChart(Object.keys(ventasPorQuincena), Object.values(ventasPorQuincena));
  actualizarPieChart(Object.keys(productosVendidos), Object.values(productosVendidos));
  mostrarTablaVentas(ventas);
}

// ================== GRÁFICO DE BARRAS: Ventas por quincena ==================
function actualizarBarChart(labels, data) {
  const ctx = document.getElementById("ventasChart").getContext("2d");
  if (ventasChart) ventasChart.destroy();
  ventasChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Ventas (S/)",
        data,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ================== GRÁFICO DE PASTEL: Productos más vendidos ==================
function actualizarPieChart(labels, data) {
  const ctx = document.getElementById("productosChart").getContext("2d");
  if (productosChart) productosChart.destroy();
  productosChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
          "#9966FF", "#FF9F40", "#46BFBD", "#FDB45C", 
          "#949FB1", "#4D5360"
        ]
      }]
    }
  });
}

// ================== TABLA DE VENTAS ==================
function mostrarTablaVentas(ventas) {
  ventasTableBody.innerHTML = "";
  ventas.forEach(v => {
    v.productos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.fecha.toLocaleDateString()}</td>
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>S/ ${(p.precio * p.cantidad).toFixed(2)}</td>
      `;
      ventasTableBody.appendChild(tr);
    });
  });
}

// ================== TABLA DE PRODUCTOS CON FILTRO ==================
function mostrarProductos() {
  const categoriaSeleccionada = categoriaFilter.value;
  const searchValue = searchInput.value.toLowerCase();

  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = !categoriaSeleccionada || p.categoria === categoriaSeleccionada;
    const coincideBusqueda = p.nombre.toLowerCase().includes(searchValue);
    return coincideCategoria && coincideBusqueda;
  });

  productosTableBody.innerHTML = "";

  if (productosFiltrados.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="text-center text-muted">No se encontraron productos</td>`;
    productosTableBody.appendChild(tr);
    return;
  }

  productosFiltrados.forEach(p => {
    const tr = document.createElement("tr");
    const stockClass = p.stock === 0 ? "text-danger fw-bold" : p.stock <= 5 ? "text-warning fw-bold" : "";
    const stockText = p.stock === 0 ? "AGOTADO" : p.stock;

    tr.innerHTML = `
      <td><img src="${p.imagenUrl}" width="50" class="rounded"></td>
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td><span class="badge bg-primary">${p.categoria}</span></td>
      <td>S/ ${p.precio.toFixed(2)}</td>
      <td class="${stockClass}">${stockText}</td>
    `;
    productosTableBody.appendChild(tr);
  });
}

// ================== LIMPIAR GRÁFICOS ==================
function clearCharts() {
  if (ventasChart) ventasChart.destroy();
  if (productosChart) productosChart.destroy();
}

// ================== EXPORTAR A CSV ==================
exportBtn.addEventListener("click", () => {
  let csv = "Fecha,Producto,Cantidad,Total\n";
  Array.from(ventasTableBody.querySelectorAll("tr")).forEach(tr => {
    const tds = tr.querySelectorAll("td");
    csv += `${tds[0].textContent},${tds[1].textContent},${tds[2].textContent},${tds[3].textContent}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ventas_${fechaInicio.value}_a_${fechaFin.value}.csv`;
  a.click();
});