<?php
class DetalleCompra
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function insertarDetalle($id_compra, $linea)
    {
        $subtotal = $linea->cantidad * $linea->precio_unitario;

        $sql = "INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_unitario, subtotal)
                VALUES ($id_compra, $linea->id_producto, $linea->cantidad, $linea->precio_unitario, $subtotal)";

        mysqli_query($this->conexion, $sql) or die('No se pudo insertar el detalle de la compra');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Detalle de compra insertado";

        return $vec;
    }

    public function consultaPorCompra($id_compra)
    {
        $sql = "SELECT dc.*, p.nombre AS nombre_producto, p.codigo
                FROM detalle_compra dc
                INNER JOIN productos p ON dc.id_producto = p.id_producto
                WHERE dc.id_compra = $id_compra";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar el detalle de la compra');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }
}