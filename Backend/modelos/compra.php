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
        $sql = "SELECT c.*, p.nombre AS nombre_proveedor, u.nombres AS nombre_usuario, u.apellidos AS apellido_usuario
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
        $sql = "SELECT c.*, p.nombre AS nombre_proveedor, u.nombres AS nombre_usuario, u.apellidos AS apellido_usuario
                FROM compras c
                INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
                INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
                WHERE c.id_compra = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar la compra');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function consultaPorUsuario($id_usuario)
    {
        $sql = "SELECT c.*, p.nombre AS nombre_proveedor, u.nombres AS nombre_usuario
            FROM compras c
            INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.id_usuario = $id_usuario
            ORDER BY c.fecha DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar las compras del usuario');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }


    public function insertar($params)
    {
        // Generar el numero_compra automaticamente
        $sqlNumero = "SELECT numero_compra FROM compras ORDER BY id_compra DESC LIMIT 1";
        $resNumero = mysqli_query($this->conexion, $sqlNumero);
        $filaNumero = mysqli_fetch_array($resNumero);

        if ($filaNumero) {
            $ultimoNumero = intval(substr($filaNumero['numero_compra'], 4));
            $siguienteNumero = $ultimoNumero + 1;
        } else {
            $siguienteNumero = 1;
        }

        $numero_compra = 'COMP' . str_pad($siguienteNumero, 4, '0', STR_PAD_LEFT);

        $sql = "INSERT INTO compras (numero_compra, id_proveedor, id_usuario, total, estado)
            VALUES ('$numero_compra', $params->id_proveedor, $params->id_usuario, $params->total, 'Completada')";
        mysqli_query($this->conexion, $sql) or die('No se pudo registrar la compra');

        $id_compra = mysqli_insert_id($this->conexion);

        $detalleCompra = new DetalleCompra($this->conexion);
        $producto = new Producto($this->conexion);

        foreach ($params->detalle as $linea) {
            $detalleCompra->insertarDetalle($id_compra, $linea);
            $producto->actualizarStock($linea->id_producto, $linea->cantidad);

            $sqlMov = "INSERT INTO movimientos_inventario (tipo, id_producto, cantidad, id_usuario, referencia, descripcion)
                   VALUES ('Entrada', $linea->id_producto, $linea->cantidad, $params->id_usuario, 'Compra #$id_compra', 'Entrada por compra')";
            mysqli_query($this->conexion, $sqlMov) or die('No se pudo registrar el movimiento de inventario');
        }

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se registro la compra correctamente";
        $vec['id_compra'] = $id_compra;
        $vec['numero_compra'] = $numero_compra;

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

    public function cancelar($id)
    {
        // 1. Verificar que la compra no este ya cancelada
        $sqlEstado = "SELECT estado FROM compras WHERE id_compra = $id";
        $resEstado = mysqli_query($this->conexion, $sqlEstado);
        $filaEstado = mysqli_fetch_array($resEstado);

        if ($filaEstado['estado'] == 'Cancelada') {
            $vec = [];
            $vec['resultado'] = "Error";
            $vec['mensaje'] = "Esta compra ya está cancelada";
            return $vec;
        }

        // 2. Traer el detalle de la compra para revertir el stock
        $detalleCompra = new DetalleCompra($this->conexion);
        $lineas = $detalleCompra->consultaPorCompra($id);

        $producto = new Producto($this->conexion);

        // 3. Traer id_usuario de la compra (para el movimiento de inventario)
        $sqlUsuario = "SELECT id_usuario FROM compras WHERE id_compra = $id";
        $resUsuario = mysqli_query($this->conexion, $sqlUsuario);
        $filaUsuario = mysqli_fetch_array($resUsuario);
        $id_usuario = $filaUsuario['id_usuario'];

        foreach ($lineas as $linea) {
            // Restamos el stock que se habia sumado con la compra
            $producto->actualizarStock($linea['id_producto'], -$linea['cantidad']);

            // Registramos el movimiento compensatorio
            $sqlMov = "INSERT INTO movimientos_inventario (tipo, id_producto, cantidad, id_usuario, referencia, descripcion)
                   VALUES ('Salida', {$linea['id_producto']}, {$linea['cantidad']}, $id_usuario, 'Canc. C#$id', 'Reversión por cancelación de compra')";
            mysqli_query($this->conexion, $sqlMov) or die('No se pudo registrar el movimiento de reversion');
        }

        // 4. Cambiar el estado de la compra a Cancelada
        $sql = "UPDATE compras SET estado = 'Cancelada' WHERE id_compra = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo cancelar la compra');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Compra cancelada y stock revertido correctamente";

        return $vec;
    }

    public function comprasPorCategoria($fecha_inicio = null, $fecha_fin = null)
    {
        $where = "WHERE c.estado = 'Completada'";
        if ($fecha_inicio && $fecha_fin) {
            $where .= " AND c.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $sql = "SELECT cat.nombre AS categoria, SUM(dc.subtotal) AS total
            FROM detalle_compra dc
            INNER JOIN productos p ON dc.id_producto = p.id_producto
            INNER JOIN categorias cat ON p.id_categoria = cat.id_categoria
            INNER JOIN compras c ON dc.id_compra = c.id_compra
            $where
            GROUP BY cat.nombre
            ORDER BY total DESC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar las compras por categoria');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function tendenciaCompras($fecha_inicio = null, $fecha_fin = null)
    {
        $where = "WHERE c.estado = 'Completada'";
        if ($fecha_inicio && $fecha_fin) {
            $where .= " AND c.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $sql = "SELECT DATE_FORMAT(c.fecha, '%Y-%m') AS mes, SUM(c.total) AS total
            FROM compras c
            $where
            GROUP BY mes
            ORDER BY mes ASC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar la tendencia de compras');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function productosMasComprados($limite = 5, $fecha_inicio = null, $fecha_fin = null)
    {
        $where = "WHERE c.estado = 'Completada'";
        if ($fecha_inicio && $fecha_fin) {
            $where .= " AND c.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $sql = "SELECT p.nombre, SUM(dc.cantidad) AS unidades, SUM(dc.subtotal) AS gastos
            FROM detalle_compra dc
            INNER JOIN productos p ON dc.id_producto = p.id_producto
            INNER JOIN compras c ON dc.id_compra = c.id_compra
            $where
            GROUP BY p.nombre
            ORDER BY gastos DESC
            LIMIT $limite";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar los productos mas comprados');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }
}
