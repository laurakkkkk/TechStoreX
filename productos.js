
const productos = [
    {
        id: 1,
        nombre: "Laptop HP",
        precio: 100000,
        imagen: "https://http2.mlstatic.com/D_NQ_NP_640104-MLU72721294581_112023-O.webp",
        descripcion: "Laptop HP con 8GB RAM, 256GB SSD"
    },
    {
        id: 2,
        nombre: "Monitor Samsung",
        precio: 300000,
        imagen: "https://alavista.co/wp-content/uploads/2024/07/c08484411.png",
        descripcion: "12 pulgadas led"
    },
    {
        id: 3,
        nombre: "Samsung TV 4K",
        precio: 50000,
        imagen: "https://http2.mlstatic.com/D_NQ_NP_829848-MCO78587340372_082024-O.webp",
        descripcion: "Smart TV Samsung 55 pulgadas"
    },
    {
        id: 2,
        nombre: "Mouse inalambrico",
        precio: 30000,
        imagen: "https://www.quorumsystem.com.co/wp-content/uploads/2024/07/04593.png",
        descripcion: "RGB"
    },
    
];
let carrito = [];
let direccionesGuardadas = [];


function inicializarPagina() {
    cargarCarrito();
    cargarDirecciones();
    
    if (document.getElementById('products')) {
        mostrarProductos();
    }
    
    if (document.getElementById('carrito-contenido')) {
        mostrarCarrito();
    }
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

function cargarDirecciones() {
    const direcciones = localStorage.getItem('direcciones');
    if (direcciones) {
        direccionesGuardadas = JSON.parse(direcciones);
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function guardarDirecciones() {
    localStorage.setItem('direcciones', JSON.stringify(direccionesGuardadas));
}

// Funciones de productos
function mostrarProductos() {
    const productosContainer = document.getElementById('products');
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoElement);
    });
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        const itemEnCarrito = carrito.find(item => item.id === productoId);
        
        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }
        
        guardarCarrito();
        mostrarMensaje('Producto agregado al carrito');
    }
}

// Funciones del carrito
function mostrarCarrito() {
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoTotal = document.getElementById('carrito-total');

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p>No hay productos en el carrito</p>';
        carritoTotal.innerHTML = '';
        return;
    }

    let html = '<table class="carrito-tabla">';
    html += `
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
            <th>Acciones</th>
        </tr>
    `;

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <tr>
                <td>${item.nombre}</td>
                <td>
                    <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    ${item.cantidad}
                    <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += '</table>';
    carritoContenido.innerHTML = html;
    carritoTotal.innerHTML = `
        <h3>Total: $${total.toFixed(2)}</h3>
        <button onclick="iniciarCheckout()" class="btn-comprar">Realizar compra</button>
    `;
}

function cambiarCantidad(productoId, cambio) {
    const index = carrito.findIndex(item => item.id === productoId);
    
    if (index !== -1) {
        carrito[index].cantidad += cambio;
        
        if (carrito[index].cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== productoId);
        }
        
        guardarCarrito();
        mostrarCarrito();
    }
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito();
    mostrarCarrito();
}

// Funciones de checkout y envío
function iniciarCheckout() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito está vacío', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-contenido">
            <h2>Información de Envío</h2>
            <div class="direcciones-guardadas">
                ${mostrarDireccionesGuardadas()}
            </div>
            <form id="formulario-envio" onsubmit="procesarCompra(event)">
                <div class="form-grupo">
                    <label for="nombre">Nombre completo:</label>
                    <input type="text" id="nombre" required>
                </div>
                
                <div class="form-grupo">
                    <label for="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" required pattern="[0-9]{9}" 
                           placeholder="Ej: 123456789">
                </div>

                <div class="form-grupo">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>

                <div class="form-grupo">
                    <label for="calle">Calle y número:</label>
                    <input type="text" id="calle" required>
                </div>

                <div class="form-grupo">
                    <label for="piso">Piso/Puerta (opcional):</label>
                    <input type="text" id="piso">
                </div>

                <div class="form-grupo">
                    <label for="ciudad">Ciudad:</label>
                    <input type="text" id="ciudad" required>
                </div>

                <div class="form-grupo">
                    <label for="codigo-postal">Código Postal:</label>
                    <input type="text" id="codigo-postal" required pattern="[0-9]{5}" 
                           placeholder="Ej: 28001">
                </div>

                <div class="form-grupo">
                    <label for="provincia">Provincia:</label>
                    <input type="text" id="provincia" required>
                </div>

                <div class="form-checkbox">
                    <input type="checkbox" id="guardar-direccion">
                    <label for="guardar-direccion">Guardar esta dirección para futuras compras</label>
                </div>

                <div class="form-botones">
                    <button type="submit" class="btn-primario">Confirmar Pedido</button>
                    <button type="button" onclick="cerrarModal()" class="btn-secundario">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function mostrarDireccionesGuardadas() {
    if (direccionesGuardadas.length === 0) return '';

    let html = '<h3>Direcciones guardadas:</h3><div class="direcciones-lista">';
    direccionesGuardadas.forEach((dir, index) => {
        html += `
            <div class="direccion-guardada" onclick="usarDireccionGuardada(${index})">
                <p><strong>${dir.nombre}</strong></p>
                <p>${dir.calle}${dir.piso ? ', ' + dir.piso : ''}</p>
                <p>${dir.ciudad}, ${dir.codigoPostal}</p>
                <p>${dir.provincia}</p>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function usarDireccionGuardada(index) {
    const dir = direccionesGuardadas[index];
    document.getElementById('nombre').value = dir.nombre;
    document.getElementById('telefono').value = dir.telefono;
    document.getElementById('email').value = dir.email;
    document.getElementById('calle').value = dir.calle;
    document.getElementById('piso').value = dir.piso || '';
    document.getElementById('ciudad').value = dir.ciudad;
    document.getElementById('codigo-postal').value = dir.codigoPostal;
    document.getElementById('provincia').value = dir.provincia;
}

function procesarCompra(event) {
    event.preventDefault();
    
    const datosEnvio = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        calle: document.getElementById('calle').value,
        piso: document.getElementById('piso').value,
        ciudad: document.getElementById('ciudad').value,
        codigoPostal: document.getElementById('codigo-postal').value,
        provincia: document.getElementById('provincia').value
    };

    if (document.getElementById('guardar-direccion').checked) {
        direccionesGuardadas.push(datosEnvio);
        guardarDirecciones();
    }

    const pedido = {
        datosEnvio,
        productos: carrito,
        fecha: new Date().toISOString(),
        total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    };

    // Aquí normalmente enviarías el pedido al servidor
    mostrarConfirmacion(pedido);
    carrito = [];
    guardarCarrito();
    cerrarModal();
}

// Funciones de UI
function mostrarMensaje(mensaje, tipo = 'success') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje mensaje-${tipo}`;
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

function mostrarConfirmacion(pedido) {
    const confirmacion = document.createElement('div');
    confirmacion.className = 'modal';
    confirmacion.innerHTML = `
        <div class="modal-contenido">
            <h2>¡Pedido Confirmado!</h2>
            <div class="confirmacion-detalles">
                <h3>Detalles del envío</h3>
                <p><strong>Nombre:</strong> ${pedido.datosEnvio.nombre}</p>
                <p><strong>Dirección:</strong> ${pedido.datosEnvio.calle}${pedido.datosEnvio.piso ? ', ' + pedido.datosEnvio.piso : ''}</p>
                <p>${pedido.datosEnvio.ciudad}, ${pedido.datosEnvio.codigoPostal}</p>
                <p>${pedido.datosEnvio.provincia}</p>
                <p><strong>Email:</strong> ${pedido.datosEnvio.email}</p>
                <p><strong>Teléfono:</strong> ${pedido.datosEnvio.telefono}</p>
                
                <h3>Resumen del pedido</h3>
                <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
                <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString()}</p>
            </div>
            <button onclick="finalizarCompra()" class="btn-primario">Volver a la tienda</button>
        </div>
    `;
    document.body.appendChild(confirmacion);
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function finalizarCompra() {
    window.location.href = 'index.html';
}

// Inicializar cuando se carga la página
window.onload = inicializarPagina;