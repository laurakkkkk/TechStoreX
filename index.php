<?php include('productos.php'); ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechStoreX - CRUD de Productos</title>
    <link rel="stylesheet" href="styles2.css">
</head>
<body>
    <h1>Gestión de Productos</h1>

    <!-- Formulario para agregar productos -->
    <form id="formAgregarProducto">
        <h2>Agregar Producto</h2>
        <input type="text" id="nombre" placeholder="Nombre" required>
        <input type="number" id="precio" placeholder="Precio" required>
        <input type="text" id="imagen" placeholder="URL de la imagen" required>
        <textarea id="descripcion" placeholder="Descripción" required></textarea>
        <button type="submit">Agregar Producto</button>
    </form>

    <!-- Listado de productos -->
    <h2>Lista de Productos</h2>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Descripción</th>
            </tr>
        </thead>
        <tbody id="productosTabla">
            <!-- Los productos se cargarán dinámicamente aquí -->
        </tbody>
    </table>

    <script>
        // Cargar productos desde el servidor
        function cargarProductos() {
            fetch('productos.php', {
                method: 'GET'
            }).then(response => response.json())
              .then(data => {
                let tabla = document.getElementById('productosTabla');
                tabla.innerHTML = '';  // Limpiar tabla antes de cargar nuevos productos
                
                data.forEach(producto => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.nombre}</td>
                        <td>$${producto.precio}</td>
                        <td><img src="${producto.imagen}" alt="Producto" width="100"></td>
                        <td>${producto.descripcion}</td>
                    `;
                    tabla.appendChild(row);
                });
            });
        }

        // Agregar un producto
        document.getElementById('formAgregarProducto').addEventListener('submit', function(event) {
            event.preventDefault();

            let nombre = document.getElementById('nombre').value;
            let precio = document.getElementById('precio').value;
            let imagen = document.getElementById('imagen').value;
            let descripcion = document.getElementById('descripcion').value;

            const formData = new FormData();
            formData.append('accion', 'agregar');
            formData.append('nombre', nombre);
            formData.append('precio', precio);
            formData.append('imagen', imagen);
            formData.append('descripcion', descripcion);

            fetch('productos.php', {
                method: 'POST',
                body: formData
            }).then(response => {
                cargarProductos();  // Recargar los productos después de agregar
            }).catch(error => console.error('Error al agregar producto:', error));
        });

        // Cargar productos al iniciar la página
        cargarProductos();
    </script>
</body>
</html>
