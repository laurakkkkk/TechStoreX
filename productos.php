<?php
include('db.php'); // Asegúrate de que la ruta a db.php sea correcta

// Función para obtener todos los productos
function obtenerProductos() {
    global $conn;
    $sql = "SELECT * FROM productos";
    $result = $conn->query($sql);
    
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Función para agregar un producto
function agregarProducto($nombre, $precio, $imagen, $descripcion) {
    global $conn;
    $sql = "INSERT INTO productos (nombre, precio, imagen, descripcion) VALUES ('$nombre', '$precio', '$imagen', '$descripcion')";
    
    return $conn->query($sql);
}

// Si hay datos en el formulario, agregarlos a la base de datos
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['accion']) && $_POST['accion'] == 'agregar') {
        $nombre = $_POST['nombre'];
        $precio = $_POST['precio'];
        $imagen = $_POST['imagen'];
        $descripcion = $_POST['descripcion'];
        agregarProducto($nombre, $precio, $imagen, $descripcion);
    }
}

// Obtener productos para mostrarlos
$productos = obtenerProductos();
echo json_encode($productos);
?>
