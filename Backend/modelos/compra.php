<?php
class Compra
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function consulta()
    {
        $sql = "SELECT c.*, p.nombre AS nombre_proveedor, u.nombres AS nombre_usuario
                FROM compras c
                INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
                INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
                ORDER BY c.fecha DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla compras');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT c.*, p.nombre AS nombre_proveedor, u.nombres AS nombre_usuario
                FROM compras c
                INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
                INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
                WHERE c.id_compra = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar la compra');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params)
    {
        // 1. Insertar la cabecera de la compra
        $sql = "INSERT INTO compras (numero_compra, id_proveedor, id_usuario, total, estado)
            VALUES ('$params->numero_compra', $params->id_proveedor, $params->id_usuario, $params->total, 'Completada')";
        mysqli_query($this->conexion, $sql) or die('No se pudo registrar la compra');

        // 2. Obtener el id de la compra recien insertada
        $id_compra = mysqli_insert_id($this->conexion);

        // 3. Por cada linea del detalle: insertar detalle, actualizar stock, registrar movimiento
        $detalleCompra = new DetalleCompra($this->conexion);
        $producto = new Producto($this->conexion);

        foreach ($params->detalle as $linea) {
            // Insertar la linea de detalle
            $detalleCompra->insertarDetalle($id_compra, $linea);

            // Aumentar el stock del producto (entrada)
            $producto->actualizarStock($linea->id_producto, $linea->cantidad);

            // Registrar el movimiento de inventario
            $sqlMov = "INSERT INTO movimientos_inventario (tipo, id_producto, cantidad, id_usuario, referencia, descripcion)
                   VALUES ('Entrada', $linea->id_producto, $linea->cantidad, $params->id_usuario, 'Compra #$id_compra', 'Entrada por compra')";
            mysqli_query($this->conexion, $sqlMov) or die('No se pudo registrar el movimiento de inventario');
        }

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se registro la compra correctamente";
        $vec['id_compra'] = $id_compra;

        return $vec;
    }

    public function editar($id, $params)
    {
        // Solo permite editar datos generales de la compra, no el detalle
        // (editar el detalle de una compra ya completada afectaria el stock de forma dificil de rastrear)
        $sql = "UPDATE compras SET
                    id_proveedor = $params->id_proveedor,
                    estado = '$params->estado'
                WHERE id_compra = $id";

        mysqli_query($this->conexion, $sql) or die('No se pudo editar la compra');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito la compra";

        return $vec;
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM compras WHERE id_compra = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar la compra');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Compra eliminada correctamente";

        return $vec;
    }

    public function obtenerDetalleCompra($id_compra)
    {
        $detalleCompra = new DetalleCompra($this->conexion);
        return $detalleCompra->consultaPorCompra($id_compra);
    }
}
