<?php
class Cliente
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function consulta() {
    $sql = "SELECT * FROM clientes WHERE estado = 1 ORDER BY nombre";
    $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla clientes');

    $vec = [];
    while ($row = mysqli_fetch_array($res)) {
        $vec[] = $row;
    }
    return $vec;
}

    public function buscarPorId($id)
    {
        $sql = "SELECT * FROM clientes WHERE id_cliente = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar el cliente');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params)
    {
        $sql = "INSERT INTO clientes (identificacion, nombre, telefono, email, direccion, ciudad, estado)
                VALUES ('$params->identificacion', '$params->nombre', '$params->telefono', '$params->email', '$params->direccion', '$params->ciudad', 1)";

        mysqli_query($this->conexion, $sql) or die('No se agrego el cliente');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se agrego el cliente";

        return $vec;
    }

    public function editar($id, $params)
    {
        $sql = "UPDATE clientes SET
                    identificacion = '$params->identificacion',
                    nombre = '$params->nombre',
                    telefono = '$params->telefono',
                    email = '$params->email',
                    direccion = '$params->direccion',
                    ciudad = '$params->ciudad'
                WHERE id_cliente = $id";

        mysqli_query($this->conexion, $sql) or die('No se pudo editar el cliente');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito el cliente";

        return $vec;
    }

   public function eliminar($id) {
    $sql = "UPDATE clientes SET estado = 0 WHERE id_cliente = $id";
    mysqli_query($this->conexion, $sql) or die('No se pudo eliminar el cliente');

    $vec = [];
    $vec['resultado'] = "Ok";
    $vec['mensaje'] = "Cliente eliminado correctamente";

    return $vec;
}
}
?>