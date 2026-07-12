<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/marca.php');

$control = $_GET['control'];
$marca = new Marca($conexion);

switch ($control) {
    case 'consulta':
        $vec = $marca->consulta();
        break;

    case 'buscarPorId':
        $id = $_GET['id'];
        $vec = $marca->buscarPorId($id);
        break;

    case 'insertar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $marca->insertar($params);
        break;

    case 'editar':
        $json = file_get_contents('php://input');
        $id = $_GET['id'];
        $params = json_decode($json);
        $vec = $marca->editar($id, $params);
        break;

    case 'eliminar':
        $id = $_GET['id'];
        $vec = $marca->eliminar($id);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;