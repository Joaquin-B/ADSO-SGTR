<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/venta.php');
require_once('../modelos/detalleVenta.php');
require_once('../modelos/producto.php');

$control = $_GET['control'];
$venta = new Venta($conexion);

switch ($control) {
    case 'consulta':
        $vec = $venta->consulta();
        break;

    case 'buscarPorId':
        $id = $_GET['id'];
        $vec = $venta->buscarPorId($id);
        break;

    case 'insertar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $venta->insertar($params);
        break;

    case 'editar':
        $json = file_get_contents('php://input');
        $id = $_GET['id'];
        $params = json_decode($json);
        $vec = $venta->editar($id, $params);
        break;

    case 'eliminar':
        $id = $_GET['id'];
        $vec = $venta->eliminar($id);
        break;

    case 'obtenerDetalleVenta':
        $id = $_GET['id'];
        $vec = $venta->obtenerDetalleVenta($id);
        break;
    case 'ventasPorCategoria':
        $vec = $venta->ventasPorCategoria();
        break;
        
    case 'productosMasVendidos':
        $limite = isset($_GET['limite']) ? $_GET['limite'] : 5;
        $vec = $venta->productosMasVendidos($limite);
        break;

    case 'cancelar':
        $id = $_GET['id'];
        $vec = $venta->cancelar($id);
        break;

    case 'tendenciaVentasCostos':
        $vec = $venta->tendenciaVentasCostos();
        break;
    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;