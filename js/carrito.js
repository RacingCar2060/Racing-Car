// js/carrito.js
(function () {
  const STORAGE_KEY = "carrito";

  function safeRead() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error leyendo carrito desde localStorage:", e);
      return [];
    }
  }

  let carrito = safeRead();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    updateBadge();
  }

  function updateBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const totalQty = carrito.reduce((s, p) => s + (Number(p.cantidad) || 0), 0);
    badge.textContent = totalQty;
  }

  function render() {
    const tbody = document.getElementById("carrito-items");
    if (!tbody) {
      console.warn("No se encontró #carrito-items en el DOM.");
      return;
    }

    tbody.innerHTML = "";
    let total = 0;

    carrito.forEach((p, index) => {
      const precio = Number(p.precio) || 0;
      const cantidad = Number(p.cantidad) || 1;
      const subtotal = precio * cantidad;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-start">
          <img src="${p.imagenurl}" width="60" class="me-2 rounded" alt="${p.nombre}">
        </td>
        <td>S/ ${precio.toFixed(2)}</td>
        <td>
          <div class="d-flex justify-content-center align-items-center gap-2">
            <button class="btn btn-outline-secondary btn-sm btn-decrease" data-index="${index}">-</button>
            <input type="number" class="form-control form-control-sm text-center cantidad-input" min="1" value="${cantidad}" data-index="${index}" style="width:80px">
            <button class="btn btn-outline-secondary btn-sm btn-increase" data-index="${index}">+</button>
          </div>
        </td>
        <td>S/ ${subtotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    const totalEl = document.getElementById("carrito-total");
    if (totalEl) totalEl.textContent = total.toFixed(2);

    // listeners (delegación ligera)
    tbody.querySelectorAll(".btn-decrease").forEach(btn => {
      btn.addEventListener("click", (e) => changeQty(Number(btn.dataset.index), -1));
    });
    tbody.querySelectorAll(".btn-increase").forEach(btn => {
      btn.addEventListener("click", (e) => changeQty(Number(btn.dataset.index), +1));
    });
    tbody.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => removeItem(Number(btn.dataset.index)));
    });
    tbody.querySelectorAll(".cantidad-input").forEach(input => {
      input.addEventListener("change", (e) => setQty(Number(input.dataset.index), e.target.value));
    });
  }

  function changeQty(index, delta) {
    if (!carrito[index]) return;
    carrito[index].cantidad = Math.max(1, (Number(carrito[index].cantidad) || 0) + delta);
    save();
    render();
  }

  function setQty(index, value) {
    if (!carrito[index]) return;
    let v = parseInt(value);
    if (isNaN(v) || v < 1) v = 1;
    carrito[index].cantidad = v;
    save();
    render();
  }

  function removeItem(index) {
    if (index < 0 || index >= carrito.length) return;
    carrito.splice(index, 1);
    save();
    render();
  }

  // Exponer utilidades para el catálogo si se necesitan
  window.carritoUtils = {
    addFromCatalog(producto) {
      // producto: { id, nombre, precio, imagenurl, cantidad? }
      const existing = carrito.find(p => p.id === producto.id);
      if (existing) existing.cantidad = (Number(existing.cantidad) || 0) + (Number(producto.cantidad) || 1);
      else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagenurl, cantidad: producto.cantidad || 1 });
      save();
    },
    refresh() {
      carrito = safeRead();
      updateBadge();
    }
  };

  // Inicializar en DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    carrito = safeRead();
    updateBadge();
    render();
  });
})();