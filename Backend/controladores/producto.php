<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');

require_once('../modelos/conexion.php');
require_once('../modelos/producto.php');

$control = $_GET['control'];
$producto = new Producto($conexion);

switch ($control) {
    case 'consulta':
        $vec = $producto->consulta();        
        break;

    case 'buscarPorId':
        $id = $_GET['id'];
        $vec = $producto->buscarPorId($id);        
        break;

    case 'insertar':
        $json = file_get_contents('php://input');       
        $params = json_decode($json);
        $vec = $producto->insertar($params);
       
        break;

    case 'editar':
        $json = file_get_contents('php://input'); 
        $id = $_GET['id'];
        $params = json_decode($json);

        $vec = $producto->editar($id, $params);
       
        break;

    case 'eliminar':
        $id = $_GET['id'];
        $vec = $producto->eliminar($id);
       
        break;

    case 'actualizarStock':
        $id = $_GET['id'];
        $params = json_decode(file_get_contents('php://input'));
        $vec = $producto->actualizarStock($id, $params->cantidad);
        break;

    case 'obtenerStock':
        $id = $_GET['id'];
        $vec = $producto->obtenerStock($id);
        break;

    case 'productosStockBajo':
        $limite = isset($_GET['limite']) ? $_GET['limite'] : 10;
        $vec = $producto->productosStockBajo($limite);
        break;

    default:
        echo json_encode(['error' => 'Controlador no valido']);
}
        header('Content-Type: application/json');
        $datos = json_encode($vec);
        echo $datos;
       