<?php
class Inventario {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function consulta() {
        $sql = "SELECT m.*, p.nombre AS nombre_producto, p.codigo, u.nombres AS nombre_usuario
                FROM movimientos_inventario m
                INNER JOIN productos p ON m.id_producto = p.id_producto
                INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
                ORDER BY m.fecha DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla movimientos_inventario');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function consultaPorProducto($id_producto) {
        $sql = "SELECT m.*, p.nombre AS nombre_producto, p.codigo, u.nombres AS nombre_usuario
                FROM movimientos_inventario m
                INNER JOIN productos p ON m.id_producto = p.id_producto
                INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
                WHERE m.id_producto = $id_producto
                ORDER BY m.fecha DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar el historial del producto');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function consultaPorFecha($fecha_inicio, $fecha_fin) {
        $sql = "SELECT m.*, p.nombre AS nombre_producto, p.codigo, u.nombres AS nombre_usuario
                FROM movimientos_inventario m
                INNER JOIN productos p ON m.id_producto = p.id_producto
                INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
                WHERE m.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'
                ORDER BY m.fecha DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar el historial por fecha');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }
}