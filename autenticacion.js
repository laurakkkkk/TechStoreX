// Inicio de Sesión
document.getElementById('login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulación de autenticación
    if (email === "admin@techstorex.com" && password === "admin123") {
        alert("Inicio de sesión exitoso.");
        window.location.href = "index.html"; // Redirige al inicio
    } else {
        alert("Credenciales incorrectas. Intenta nuevamente.");
    }
});

// Registro de Usuarios
document.getElementById('register-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulación de registro (puedes integrarlo con una API o base de datos)
    alert(`Registro exitoso.\nNombre: ${name}\nCorreo: ${email}`);
    window.location.href = "login.html"; // Redirige al login
});
