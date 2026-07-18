<?php
class Login
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }
    public function consulta($email, $contrasena)
    {
        $sql = "SELECT id_usuario, nombres, apellidos, email, rol, estado, contraseña FROM usuarios WHERE email='$email'";
        $res = mysqli_query($this->conexion, $sql) or die('Error al validar el login');

        $row = mysqli_fetch_array($res);

        $vec = [];

        if ($row && password_verify($contrasena, $row['contraseña'])) {
            unset($row['contraseña']); 
            $row['validar'] = "valida";
            $vec[0] = $row;
        } else {
            $vec[0] = array("validar" => "no valida");
        }

        return $vec;
    }

}