<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/usuario.php');

$control = $_GET['control'];
$usuario = new Usuario($conexion);

switch ($control) {
    case 'consulta':
        $vec = $usuario->consulta();
        break;

    case 'buscarPorId':
        $id = $_GET['id'];
        $vec = $usuario->buscarPorId($id);
        break;

    case 'insertar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $usuario->insertar($params);
        break;

    case 'editar':
        $json = file_get_contents('php://input');
        $id = $_GET['id'];
        $params = json_decode($json);
        $vec = $usuario->editar($id, $params);
        break;

    case 'eliminar':
        $id = $_GET['id'];
        $vec = $usuario->eliminar($id);
        break;

    case 'cambiarPassword':
        $json = file_get_contents('php://input');
        $id = $_GET['id'];
        $params = json_decode($json);
        $vec = $usuario->cambiarPassword($id, $params);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;