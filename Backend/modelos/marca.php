<?php
class Marca {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function consulta() {
        $sql = "SELECT * FROM marcas ORDER BY nombre";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla marcas');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id) {
        $sql = "SELECT * FROM marcas WHERE id_marca = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar la marca');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params) {
        $sql = "INSERT INTO marcas (nombre, estado) VALUES ('$params->nombre', 1)";
        mysqli_query($this->conexion, $sql) or die('No se agrego la marca');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se agrego la marca";

        return $vec;
    }

    public function editar($id, $params) {
        $sql = "UPDATE marcas SET nombre = '$params->nombre' WHERE id_marca = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo editar la marca');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito la marca";

        return $vec;
    }

    public function eliminar($id) {
        $sql = "DELETE FROM marcas WHERE id_marca = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar la marca');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Marca eliminada correctamente";

        return $vec;
    }
}