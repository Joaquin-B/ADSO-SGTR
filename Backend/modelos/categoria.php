<?php
class Categoria {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function consulta() {
        $sql = "SELECT * FROM categorias ORDER BY nombre";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla categorias');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id) {
        $sql = "SELECT * FROM categorias WHERE id_categoria = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar la categoria');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params) {
        $sql = "INSERT INTO categorias (nombre, descripcion, estado) VALUES ('$params->nombre', '$params->descripcion', 1)";
        mysqli_query($this->conexion, $sql) or die('No se agrego la categoria');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se agrego la categoria";

        return $vec;
    }

    public function editar($id, $params) {
        $sql = "UPDATE categorias SET nombre = '$params->nombre', descripcion = '$params->descripcion' WHERE id_categoria = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo editar la categoria');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito la categoria";

        return $vec;
    }

    public function eliminar($id) {
        $sql = "DELETE FROM categorias WHERE id_categoria = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar la categoria');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Categoria eliminada correctamente";

        return $vec;
    }
}