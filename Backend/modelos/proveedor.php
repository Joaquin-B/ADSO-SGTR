<?php
class Proveedor
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function consulta()
    {
        $sql = "SELECT * FROM proveedores WHERE estado = 1 ORDER BY nombre";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla proveedores');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT * FROM proveedores WHERE id_proveedor = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar el proveedor');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params)
    {
        try {
            $sql = "INSERT INTO proveedores (nombre, nit, telefono, email, direccion, ciudad, estado)
                VALUES ('$params->nombre', '$params->nit', '$params->telefono', '$params->email', '$params->direccion', '$params->ciudad', 1)";

            mysqli_query($this->conexion, $sql);

            $vec = [];
            $vec['resultado'] = "Ok";
            $vec['mensaje'] = "Se agrego el proveedor";

        } catch (mysqli_sql_exception $e) {
            $vec = [];
            $vec['resultado'] = "Error";

            if (strpos($e->getMessage(), 'nit') !== false) {
                $vec['mensaje'] = "Ese NIT ya está registrado";
            } else {
                $vec['mensaje'] = "No se pudo agregar el proveedor";
            }
        }

        return $vec;
    }

    public function editar($id, $params)
    {
        $sql = "UPDATE proveedores SET
                    nombre = '$params->nombre',
                    nit = '$params->nit',
                    telefono = '$params->telefono',
                    email = '$params->email',
                    direccion = '$params->direccion',
                    ciudad = '$params->ciudad'
                WHERE id_proveedor = $id";

        mysqli_query($this->conexion, $sql) or die('No se pudo editar el proveedor');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito el proveedor";

        return $vec;
    }

    public function eliminar($id)
    {
        $sql = "UPDATE proveedores SET estado = 0 WHERE id_proveedor = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar el proveedor');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Proveedor eliminado correctamente";

        return $vec;
    }
}