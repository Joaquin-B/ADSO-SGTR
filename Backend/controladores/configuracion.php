<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Header: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: application/json');

require_once('../modelos/conexion.php');
require_once('../modelos/configuracion.php');

$control = $_GET['control'];
$configuracion = new Configuracion($conexion);

switch ($control) {
    case 'consulta':
        $vec = $configuracion->consulta();
        break;

    case 'editar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $configuracion->editar($params);
        break;

    default:
        $vec = ['error' => 'Controlador no valido'];
}

$datos = json_encode($vec);
echo $datos;