<?php
class Configuracion {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function consulta() {
        $sql = "SELECT * FROM configuracion LIMIT 1";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo consultar la configuracion');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function editar($params) {
        $sql = "UPDATE configuracion SET
                    nombre_tienda = '$params->nombre_tienda',
                    nit = '$params->nit',
                    email = '$params->email',
                    telefono = '$params->telefono',
                    direccion = '$params->direccion',
                    moneda = '$params->moneda',
                    iva = $params->iva
                WHERE id_configuracion = 1";

        mysqli_query($this->conexion, $sql) or die('No se pudo actualizar la configuracion');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Configuración actualizada correctamente";

        return $vec;
    }
}