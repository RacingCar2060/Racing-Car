// Ventas Mensuales
const ctx1 = document.getElementById('ventasMensuales');
new Chart(ctx1, {
  type: 'line',
  data: {
    labels: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    datasets: [{
      label: 'Ventas (S/.)',
      data: [4500, 5200, 6100, 7000, 8300, 9100],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      fill: true,
      tension: 0.4,
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
});

// Categorías
const ctx2 = document.getElementById('categoriasProductos');
new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: ['Llantas', 'Faros', 'Filtros', 'Aceites', 'Bujías'],
    datasets: [{
      label: 'Productos',
      data: [40, 25, 15, 10, 10],
      backgroundColor: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#9333ea']
    }]
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Comparativa Ventas vs Inventario
const ctx3 = document.getElementById('comparativa');
new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: ['Jun', 'Jul', 'Ago'],
    datasets: [
      {
        label: 'Ventas',
        data: [7000, 8300, 9100],
        backgroundColor: '#2563eb'
      },
      {
        label: 'Inventario',
        data: [1500, 1200, 1000],
        backgroundColor: '#16a34a'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  }
});
