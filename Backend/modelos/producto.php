<?php
class Producto
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function consulta()
    {
        $sql = "SELECT p.*, c.nombre AS categoria, m.nombre AS marca, pr.nombre AS proveedor
            FROM productos p
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
            INNER JOIN marcas m ON p.id_marca = m.id_marca
            INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
            WHERE p.estado = 1
            ORDER BY p.nombre";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla productos');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT p.*, c.nombre AS categoria, m.nombre AS marca, pr.nombre AS proveedor
                FROM productos p
                INNER JOIN categorias c ON p.id_categoria = c.id_categoria
                INNER JOIN marcas m ON p.id_marca = m.id_marca
                INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                WHERE p.id_producto = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar el producto');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params)
    {
        try {
            $sql = "INSERT INTO productos (codigo, nombre, id_categoria, id_marca, id_proveedor, genero, color, material, precio_compra, precio_venta, stock, estado)
                VALUES ('$params->codigo', '$params->nombre', $params->id_categoria, $params->id_marca, $params->id_proveedor, '$params->genero', '$params->color', '$params->material', $params->precio_compra, $params->precio_venta, $params->stock, 1)";

            mysqli_query($this->conexion, $sql);

            $vec = [];
            $vec['resultado'] = "Ok";
            $vec['mensaje'] = "Se agrego el producto";

        } catch (mysqli_sql_exception $e) {
            $vec = [];
            $vec['resultado'] = "Error";

            if (strpos($e->getMessage(), 'codigo') !== false) {
                $vec['mensaje'] = "Ese código ya está registrado";
            } else {
                $vec['mensaje'] = "No se pudo agregar el producto";
            }
        }

        return $vec;
    }

    public function editar($id, $params)
    {
        $sql = "UPDATE productos SET
                    codigo = '$params->codigo',
                    nombre = '$params->nombre',
                    id_categoria = $params->id_categoria,
                    id_marca = $params->id_marca,
                    id_proveedor = $params->id_proveedor,
                    genero = '$params->genero',
                    color = '$params->color',
                    material = '$params->material',
                    precio_compra = $params->precio_compra,
                    precio_venta = $params->precio_venta
                WHERE id_producto = $id";

        mysqli_query($this->conexion, $sql) or die('No se pudo editar el producto');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito el producto";

        return $vec;
    }

    public function eliminar($id)
    {
        $sql = "UPDATE productos SET estado = 0 WHERE id_producto = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar el producto');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Producto eliminado correctamente";

        return $vec;
    }

    public function actualizarStock($id, $cantidad)
    {
        // $cantidad puede ser positivo (entrada, ej. compra) o negativo (salida, ej. venta)
        $sql = "UPDATE productos SET stock = stock + ($cantidad) WHERE id_producto = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo actualizar el stock');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Stock actualizado correctamente";

        return $vec;
    }

    public function obtenerStock($id)
    {
        $sql = "SELECT stock FROM productos WHERE id_producto = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo obtener el stock');

        $row = mysqli_fetch_array($res);
        return $row['stock'];
    }

    public function productosStockBajo($limite = 10)
    {
        $sql = "SELECT p.*, c.nombre AS categoria, m.nombre AS marca
            FROM productos p
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
            INNER JOIN marcas m ON p.id_marca = m.id_marca
            WHERE p.stock <= $limite AND p.estado = 1
            ORDER BY p.stock ASC";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar el stock bajo');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }
}
?>