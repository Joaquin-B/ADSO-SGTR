<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/compra.php');
require_once('../modelos/detalleCompra.php');
require_once('../modelos/producto.php');

$control = $_GET['control'];
$compra = new Compra($conexion);

switch ($control) {
    case 'consulta':
        $vec = $compra->consulta();
        break;

    case 'buscarPorId':
        $id = $_GET['id'];
        $vec = $compra->buscarPorId($id);
        break;

    case 'insertar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $compra->insertar($params);
        break;

    case 'editar':
        $json = file_get_contents('php://input');
        $id = $_GET['id'];
        $params = json_decode($json);
        $vec = $compra->editar($id, $params);
        break;

    case 'eliminar':
        $id = $_GET['id'];
        $vec = $compra->eliminar($id);
        break;

    case 'obtenerDetalleCompra':
        $id = $_GET['id'];
        $vec = $compra->obtenerDetalleCompra($id);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;