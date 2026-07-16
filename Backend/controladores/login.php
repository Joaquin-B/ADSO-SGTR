<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/login.php');

$email = $_GET['email'];
$contraseña = $_GET['contraseña'];

$login = new Login($conexion);

$vec =$login ->consulta($email, $contraseña);

$datos = json_encode($vec);
echo $datos;