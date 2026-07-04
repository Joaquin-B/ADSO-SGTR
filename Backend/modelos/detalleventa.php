<?php
class DetalleVenta {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function insertarDetalle($id_venta, $linea) {
        $subtotal = $linea->cantidad * $linea->precio_unitario;

        $sql = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                VALUES ($id_venta, $linea->id_producto, $linea->cantidad, $linea->precio_unitario, $subtotal)";

        mysqli_query($this->conexion, $sql) or die('No se pudo insertar el detalle de la venta');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Detalle de venta insertado";

        return $vec;
    }

    public function consultaPorVenta($id_venta) {
        $sql = "SELECT dv.*, p.nombre AS nombre_producto, p.codigo
                FROM detalle_venta dv
                INNER JOIN productos p ON dv.id_producto = p.id_producto
                WHERE dv.id_venta = $id_venta";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar el detalle de la venta');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }
}