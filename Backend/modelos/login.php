<?php
class Login {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function consulta($email, $contraseña) {
        $sql = "SELECT * FROM usuarios where email='$email' AND contraseña='$contraseña'";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro el usuario');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        
        if($vec == []){
            $vec[0] = array("validar"=>"no valida");
        }else{
            $vec[0]['validar'] = "valida";
        }
        return $vec;
    }

}