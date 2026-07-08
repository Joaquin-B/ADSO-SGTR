/* ============ SIDEBAR (mobile) ============ */

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.classList.toggle("show");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("show");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.classList.remove("show");
}

/* ============ CONFIRMACIONES ============ */

function confirmarAccion(mensaje) {
    return confirm(mensaje);
}

/* ============ LOGIN: mostrar/ocultar contraseña ============ */

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector("i");
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
}

/* ============ DASHBOARD: gráficos ============ */

function initDashboardCharts() {
    const ventasCtx = document.getElementById("ventasMensualesChart");
    if (ventasCtx) {
        new Chart(ventasCtx, {
            type: "line",
            data: {
                labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
                datasets: [{
                    label: "Ventas",
                    data: [52000, 58000, 49000, 63000, 55000, 67000],
                    borderColor: "#2F6FE4",
                    backgroundColor: "rgba(47, 111, 228, 0.08)",
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: "#2F6FE4"
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: "#EEF1F5" },
                        ticks: { callback: v => v.toLocaleString("es-CO") }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const categoriaCtx = document.getElementById("ventasCategoriaChart");
    if (categoriaCtx) {
        new Chart(categoriaCtx, {
            type: "doughnut",
            data: {
                labels: ["Camisas", "Pantalones", "Vestidos", "Accesorios"],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: ["#2F6FE4", "#7C5CFC", "#F4A93B", "#C9CFDA"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: "68%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { boxWidth: 10, padding: 16, font: { size: 12 } }
                    }
                }
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", initDashboardCharts);

/* ============ VENTAS: carrito de compra ============ */

const carrito = [];

const productosDemo = {
    "camiseta-blanca": { nombre: "Camiseta Blanca", precio: 45000 },
    "pantalon-negro": { nombre: "Pantalón Negro", precio: 90000 },
    "vestido-rojo": { nombre: "Vestido Casual Rojo", precio: 120000 },
    "chaqueta-cuero": { nombre: "Chaqueta de Cuero", precio: 210000 }
};

function agregarAlCarrito() {
    const select = document.getElementById("productoSelect");
    const cantidadInput = document.getElementById("cantidadInput");

    if (!select || !select.value) return;

    const producto = productosDemo[select.value];
    const cantidad = parseInt(cantidadInput.value, 10) || 1;

    carrito.push({
        nombre: producto.nombre,
        cantidad: cantidad,
        precio: producto.precio,
        subtotal: producto.precio * cantidad
    });

    renderCarrito();
    select.value = "";
    cantidadInput.value = 1;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    renderCarrito();
}

function renderCarrito() {
    const contenedor = document.getElementById("carritoContenedor");
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-cart">
                <i class="bi bi-cart"></i>
                <span>El carrito está vacío</span>
            </div>`;
    } else {
        contenedor.innerHTML = carrito.map((item, i) => `
            <div class="cart-item">
                <div>
                    <div>${item.nombre}</div>
                    <div class="text-muted" style="font-size:12.5px;">
                        ${item.cantidad} x $${item.precio.toLocaleString("es-CO")}
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <strong>$${item.subtotal.toLocaleString("es-CO")}</strong>
                    <button class="cart-item-remove" onclick="eliminarDelCarrito(${i})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join("");
    }

    actualizarResumen();
}

function actualizarResumen() {
    const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const subtotalEl = document.getElementById("subtotalValor");
    const ivaEl = document.getElementById("ivaValor");
    const totalEl = document.getElementById("totalValor");

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString("es-CO")}`;
    if (ivaEl) ivaEl.textContent = `$${iva.toLocaleString("es-CO")}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString("es-CO")}`;
}

function completarVenta() {
    if (carrito.length === 0) {
        alert("Agregue al menos un producto antes de completar la venta.");
        return;
    }
    if (confirmarAccion("¿Desea completar esta venta?")) {
        carrito.length = 0;
        renderCarrito();
        alert("Venta registrada correctamente.");
    }
}
function initReportesCharts() {
    const categoriaBarCtx = document.getElementById("ventasPorCategoriaBarChart");
    if (categoriaBarCtx) {
        new Chart(categoriaBarCtx, {
            type: "bar",
            data: {
                labels: ["Camisas", "Pantalones", "Vestidos", "Chaquetas", "Blusas"],
                datasets: [{
                    label: "Ventas",
                    data: [45000, 36000, 31000, 27000, 24000],
                    backgroundColor: "#2F6FE4",
                    borderRadius: 4,
                    maxBarThickness: 46
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: "#EEF1F5" },
                        ticks: { callback: v => v.toLocaleString("es-CO") }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const tendenciaCtx = document.getElementById("tendenciaVentasCostosChart");
    if (tendenciaCtx) {
        new Chart(tendenciaCtx, {
            type: "line",
            data: {
                labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
                datasets: [
                    {
                        label: "Ventas",
                        data: [12000, 15500, 13200, 17800],
                        borderColor: "#2F6FE4",
                        backgroundColor: "rgba(47, 111, 228, 0.08)",
                        borderWidth: 2.5,
                        tension: 0.35,
                        pointRadius: 3,
                        pointBackgroundColor: "#2F6FE4"
                    },
                    {
                        label: "Costos",
                        data: [7000, 9000, 8200, 9600],
                        borderColor: "#C9CFDA",
                        backgroundColor: "rgba(201, 207, 218, 0.08)",
                        borderWidth: 2.5,
                        tension: 0.35,
                        pointRadius: 3,
                        pointBackgroundColor: "#C9CFDA"
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { boxWidth: 10, padding: 16, font: { size: 12 } }
                    }
                },
                scales: {
                    y: {
                        grid: { color: "#EEF1F5" },
                        ticks: { callback: v => v.toLocaleString("es-CO") }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", initReportesCharts);