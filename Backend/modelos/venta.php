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
        $sql = "SELECT v.*, c.nombre AS nombre_cliente, u.nombres AS nombre_usuario, u.apellidos AS apellido_usuario
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
        $sql = "SELECT v.*, c.nombre AS nombre_cliente, u.nombres AS nombre_usuario, u.apellidos AS apellido_usuario
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
        // Generar el numero_venta automaticamente
        $sqlNumero = "SELECT numero_venta FROM ventas ORDER BY id_venta DESC LIMIT 1";
        $resNumero = mysqli_query($this->conexion, $sqlNumero);
        $filaNumero = mysqli_fetch_array($resNumero);

        if ($filaNumero) {
            $ultimoNumero = intval(substr($filaNumero['numero_venta'], 3));
            $siguienteNumero = $ultimoNumero + 1;
        } else {
            $siguienteNumero = 1;
        }

        $numero_venta = 'VTA' . str_pad($siguienteNumero, 4, '0', STR_PAD_LEFT);

        $producto = new Producto($this->conexion);

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

        $descuento = $params->descuento;
        $total = $subtotal - $descuento;

        $sql = "INSERT INTO ventas (numero_venta, id_cliente, id_usuario, subtotal, descuento, total, metodo_pago, estado)
            VALUES ('$numero_venta', $params->id_cliente, $params->id_usuario, $subtotal, $descuento, $total, '$params->metodo_pago', 'Completada')";
        mysqli_query($this->conexion, $sql) or die('No se pudo registrar la venta');

        $id_venta = mysqli_insert_id($this->conexion);

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
        $vec['numero_venta'] = $numero_venta;
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

    public function ventasPorCategoria($fecha_inicio = null, $fecha_fin = null)
    {
        $where = "WHERE v.estado = 'Completada'";
        if ($fecha_inicio && $fecha_fin) {
            $where .= " AND v.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $sql = "SELECT c.nombre AS categoria, SUM(dv.subtotal) AS total
        FROM detalle_venta dv
        INNER JOIN productos p ON dv.id_producto = p.id_producto
        INNER JOIN categorias c ON p.id_categoria = c.id_categoria
        INNER JOIN ventas v ON dv.id_venta = v.id_venta
        $where
        GROUP BY c.nombre
        ORDER BY total DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar las ventas por categoria');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function productosMasVendidos($limite = 5, $fecha_inicio = null, $fecha_fin = null)
    {
        $where = "WHERE v.estado = 'Completada'";
        if ($fecha_inicio && $fecha_fin) {
            $where .= " AND v.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $sql = "SELECT p.nombre, SUM(dv.cantidad) AS unidades, SUM(dv.subtotal) AS ingresos
        FROM detalle_venta dv
        INNER JOIN productos p ON dv.id_producto = p.id_producto
        INNER JOIN ventas v ON dv.id_venta = v.id_venta
        $where
        GROUP BY p.nombre
        ORDER BY ingresos DESC
        LIMIT $limite";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar los productos mas vendidos');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function tendenciaVentasCostos($fecha_inicio = null, $fecha_fin = null)
    {
        $where = "WHERE v.estado = 'Completada'";
        if ($fecha_inicio && $fecha_fin) {
            $where .= " AND v.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $sql = "SELECT DATE_FORMAT(v.fecha, '%Y-%m') AS mes,
               SUM(dv.subtotal) AS ventas,
               SUM(dv.cantidad * p.precio_compra) AS costos
        FROM detalle_venta dv
        INNER JOIN productos p ON dv.id_producto = p.id_producto
        INNER JOIN ventas v ON dv.id_venta = v.id_venta
        $where
        GROUP BY mes
        ORDER BY mes ASC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar la tendencia de ventas y costos');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function cancelar($id)
    {
        $sqlEstado = "SELECT estado FROM ventas WHERE id_venta = $id";
        $resEstado = mysqli_query($this->conexion, $sqlEstado);
        $filaEstado = mysqli_fetch_array($resEstado);

        if ($filaEstado['estado'] == 'Cancelada') {
            $vec = [];
            $vec['resultado'] = "Error";
            $vec['mensaje'] = "Esta venta ya está cancelada";
            return $vec;
        }

        $detalleVenta = new DetalleVenta($this->conexion);
        $lineas = $detalleVenta->consultaPorVenta($id);

        $producto = new Producto($this->conexion);

        $sqlUsuario = "SELECT id_usuario FROM ventas WHERE id_venta = $id";
        $resUsuario = mysqli_query($this->conexion, $sqlUsuario);
        $filaUsuario = mysqli_fetch_array($resUsuario);
        $id_usuario = $filaUsuario['id_usuario'];

        foreach ($lineas as $linea) {
            // Devolvemos el stock que se habia restado con la venta
            $producto->actualizarStock($linea['id_producto'], $linea['cantidad']);

            $sqlMov = "INSERT INTO movimientos_inventario (tipo, id_producto, cantidad, id_usuario, referencia, descripcion)
                   VALUES ('Entrada', {$linea['id_producto']}, {$linea['cantidad']}, $id_usuario, 'Canc. C#$id', 'Reversión por cancelación de venta')";
            mysqli_query($this->conexion, $sqlMov) or die('No se pudo registrar el movimiento de reversion');
        }

        $sql = "UPDATE ventas SET estado = 'Cancelada' WHERE id_venta = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo cancelar la venta');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Venta cancelada y stock revertido correctamente";

        return $vec;
    }
}
