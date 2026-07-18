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
        
    case 'comprasPorCategoria':
        $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : null;
        $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : null;
        $vec = $compra->comprasPorCategoria($fecha_inicio, $fecha_fin);
        break;

    case 'tendenciaCompras':
        $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : null;
        $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : null;
        $vec = $compra->tendenciaCompras($fecha_inicio, $fecha_fin);
        break;

    case 'productosMasComprados':
        $limite = isset($_GET['limite']) ? $_GET['limite'] : 5;
        $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : null;
        $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : null;
        $vec = $compra->productosMasComprados($limite, $fecha_inicio, $fecha_fin);
        break;

    case 'cancelar':
        $id = $_GET['id'];
        $vec = $compra->cancelar($id);
        break;

    case 'consultaPorUsuario':
        $id_usuario = $_GET['id_usuario'];
        $vec = $compra->consultaPorUsuario($id_usuario);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;