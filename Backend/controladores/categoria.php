<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/categoria.php');

$control = $_GET['control'];
$categoria = new Categoria($conexion);

switch ($control) {
    case 'consulta':
        $vec = $categoria->consulta();
        break;

    case 'buscarPorId':
        $id = $_GET['id'];
        $vec = $categoria->buscarPorId($id);
        break;

    case 'insertar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $categoria->insertar($params);
        break;

    case 'editar':
        $json = file_get_contents('php://input');
        $id = $_GET['id'];
        $params = json_decode($json);
        $vec = $categoria->editar($id, $params);
        break;

    case 'eliminar':
        $id = $_GET['id'];
        $vec = $categoria->eliminar($id);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;