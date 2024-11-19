let cart = [];

// Referencias a los elementos del DOM
const cartSection = document.getElementById('cart-items');
const checkoutButton = document.getElementById('checkout-btn');

// Función para agregar productos al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (product) {
        cart.push(product);
        alert(`${product.name} agregado al carrito.`);
        updateCartDisplay();
    } else {
        alert("Producto no encontrado.");
    }
}

// Función para mostrar el contenido del carrito
function updateCartDisplay() {
    if (!cartSection) return;

    if (cart.length > 0) {
        cartSection.innerHTML = cart.map((item, index) => `
            <div>
                <h3>${item.name}</h3>
                <p>Precio: $${item.price}</p>
                <button onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `).join('') + `
            <p>Total: $${calculateTotal()}</p>
            <div>
                <label for="address">Dirección de envío:</label>
                <input type="text" id="address" placeholder="Ingresa tu dirección">
                <button id="confirm-btn" onclick="confirmPurchase()">Confirmar Compra</button>
            </div>
        `;
    } else {
        cartSection.innerHTML = '<p>Tu carrito está vacío.</p>';
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Función para calcular el total del carrito
function calculateTotal() {
    return cart.reduce((total, product) => total + product.price, 0);
}

// Función para confirmar la compra
function confirmPurchase() {
    const address = document.getElementById('address').value;

    if (address.trim() === '') {
        alert("Por favor, ingresa una dirección de envío.");
    } else {
        alert(`Compra confirmada. Tus productos serán enviados a: ${address}`);
        cart = []; // Vacía el carrito después de la compra
        updateCartDisplay(); // Actualiza el carrito en la pantalla
    }
}

// Inicializa la vista del carrito al cargar la página
document.addEventListener('DOMContentLoaded', updateCartDisplay);
