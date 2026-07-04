<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/inventario.php');

$control = $_GET['control'];
$inventario = new Inventario($conexion);

switch ($control) {
    case 'consulta':
        $vec = $inventario->consulta();
        break;

    case 'consultaPorProducto':
        $id_producto = $_GET['id_producto'];
        $vec = $inventario->consultaPorProducto($id_producto);
        break;

    case 'consultaPorFecha':
        $fecha_inicio = $_GET['fecha_inicio'];
        $fecha_fin = $_GET['fecha_fin'];
        $vec = $inventario->consultaPorFecha($fecha_inicio, $fecha_fin);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;