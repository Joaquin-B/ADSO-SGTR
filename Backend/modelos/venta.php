<?php
class Venta
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function consulta()
    {
        $sql = "SELECT v.*, c.nombre AS nombre_cliente, u.nombres AS nombre_usuario
                FROM ventas v
                INNER JOIN clientes c ON v.id_cliente = c.id_cliente
                INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
                ORDER BY v.fecha DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla ventas');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT v.*, c.nombre AS nombre_cliente, u.nombres AS nombre_usuario
                FROM ventas v
                INNER JOIN clientes c ON v.id_cliente = c.id_cliente
                INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
                WHERE v.id_venta = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar la venta');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params)
    {
       
        $producto = new Producto($this->conexion);

        // 1. Validar stock suficiente y calcular el subtotal en el mismo recorrido
        $subtotal = 0;
        foreach ($params->detalle as $linea) {
            $stockActual = $producto->obtenerStock($linea->id_producto);
            if ($stockActual < $linea->cantidad) {
                $vec = [];
                $vec['resultado'] = "Error";
                $vec['mensaje'] = "Stock insuficiente para el producto id $linea->id_producto";
                return $vec;
            }

            $subtotal += $linea->cantidad * $linea->precio_unitario;
        }

        // 2. Calcular el total con el descuento aplicado
        $descuento = $params->descuento;
        $total = $subtotal - $descuento;

        // 3. Insertar la cabecera de la venta
        $sql = "INSERT INTO ventas (numero_venta, id_cliente, id_usuario, subtotal, descuento, total, metodo_pago, estado)
            VALUES ('$params->numero_venta', $params->id_cliente, $params->id_usuario, $subtotal, $descuento, $total, '$params->metodo_pago', 'Completada')";
        mysqli_query($this->conexion, $sql) or die('No se pudo registrar la venta');

        // 4. Obtener el id de la venta recien insertada
        $id_venta = mysqli_insert_id($this->conexion);

        // 5. Por cada linea del detalle: insertar detalle, disminuir stock, registrar movimiento
        $detalleVenta = new DetalleVenta($this->conexion);

        foreach ($params->detalle as $linea) {
            $detalleVenta->insertarDetalle($id_venta, $linea);
            $producto->actualizarStock($linea->id_producto, -$linea->cantidad);

            $sqlMov = "INSERT INTO movimientos_inventario (tipo, id_producto, cantidad, id_usuario, referencia, descripcion)
                   VALUES ('Salida', $linea->id_producto, $linea->cantidad, $params->id_usuario, 'Venta #$id_venta', 'Salida por venta')";
            mysqli_query($this->conexion, $sqlMov) or die('No se pudo registrar el movimiento de inventario');
        }

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se registro la venta correctamente";
        $vec['id_venta'] = $id_venta;
        $vec['subtotal'] = $subtotal;
        $vec['total'] = $total;

        return $vec;
    }

    public function editar($id, $params)
    {
        // Solo permite cambiar el estado (ej. anular/cancelar una venta)
        $sql = "UPDATE ventas SET estado = '$params->estado' WHERE id_venta = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo editar la venta');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito la venta";

        return $vec;
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM ventas WHERE id_venta = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar la venta');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Venta eliminada correctamente";

        return $vec;
    }

    public function obtenerDetalleVenta($id_venta)
    {
        $detalleVenta = new DetalleVenta($this->conexion);
        return $detalleVenta->consultaPorVenta($id_venta);
    }
}
