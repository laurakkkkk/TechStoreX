
function mostrarCarrito() {
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoTotal = document.getElementById('carrito-total');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p class="carrito-vacio">No hay productos en el carrito</p>';
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
        <button onclick="realizarCompra()" class="btn-comprar">Realizar compra</button>
    `;
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(productoId, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(item => item.id === productoId);
    
    if (index !== -1) {
        carrito[index].cantidad += cambio;
        
        if (carrito[index].cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== productoId);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(productoId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Función para mostrar el formulario de envío
function mostrarFormularioEnvio() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-contenido">
            <h2>Información de Envío</h2>
            <form id="formulario-envio" onsubmit="procesarCompra(event)">
                <div class="form-grupo">
                    <label for="nombre">Nombre completo:</label>
                    <input type="text" id="nombre" required>
                </div>
                
                <div class="form-grupo">
                    <label for="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" required pattern="[0-9]{9}" placeholder="123456789">
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
                    <input type="text" id="codigo-postal" required pattern="[0-9]{5}" placeholder="28001">
                </div>

                <div class="form-grupo">
                    <label for="provincia">Provincia:</label>
                    <input type="text" id="provincia" required>
                </div>

                <div class="form-grupo">
                    <label for="instrucciones">Instrucciones de entrega (opcional):</label>
                    <textarea id="instrucciones" rows="3"></textarea>
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

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Función para procesar la compra
function procesarCompra(event) {
    event.preventDefault();

    const datosEnvio = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: `${document.getElementById('calle').value} ${document.getElementById('piso').value || ''} ${document.getElementById('ciudad').value}, ${document.getElementById('codigo-postal').value} ${document.getElementById('provincia').value}`.trim(),
        instrucciones: document.getElementById('instrucciones').value
    };

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const pedido = {
        ...datosEnvio,
        productos: carrito,
        total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
        fecha: new Date().toISOString()
    };

    // Enviar datos al servidor
    fetch('guardar_pedido.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Depurar la respuesta
        if (data.status === 'success') {
            mostrarConfirmacion(pedido);
            localStorage.removeItem('carrito');
            cerrarModal();
        } else {
            alert('Error al guardar el pedido: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar el pedido');
    });
}

// Función para mostrar la confirmación
function mostrarConfirmacion(pedido) {
    const confirmacion = document.createElement('div');
    confirmacion.className = 'modal';
    confirmacion.innerHTML = `
        <div class="modal-contenido">
            <h2>¡Pedido Confirmado!</h2>
            <p>Detalles del pedido han sido enviados a tu email.</p>
            <button onclick="window.location.href='index.html'" class="btn-primario">Volver a la tienda</button>
        </div>
    `;
    document.body.appendChild(confirmacion);
}

// Función para realizar la compra
function realizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    mostrarFormularioEnvio();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje';
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}
function realizarPedido() {
    const pedido = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        instrucciones: document.getElementById('instrucciones').value,
        total: calcularTotal() // Asegúrate de que esta función esté bien definida
    };

    // Verificar los datos antes de enviarlos
    console.log("Enviando pedido:", pedido);

    fetch('http://localhost/tienda_online/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Pedido realizado con éxito');
            // Redirigir o realizar otras acciones si el pedido fue exitoso
        } else {
            alert('Error al procesar el pedido: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al procesar el pedido');
    });
}


// Inicializar la página del carrito
window.onload = function() {
    mostrarCarrito();

    fetch('http://localhost/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
})
.then(response => response.json())
.then(data => {
    console.log(data); // Depurar la respuesta
    if (data.status === 'success') {
        mostrarConfirmacion(pedido);
        localStorage.removeItem('carrito');
        cerrarModal();
    } else {
        alert('Error al guardar el pedido: ' + data.message);
    }
})
.catch(error => {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar el pedido');
});

};
