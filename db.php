<?php
$servername = "localhost";
$username = "root";    // Usuario predeterminado en XAMPP
$password = "";        // Contraseña vacía para el usuario root por defecto en XAMPP
$dbname = "techstorex"; // Asegúrate de que el nombre de la base de datos sea correcto
$conn = new mysqli('127.0.0.1', 'root', '', 'techstorex');


// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
