<?php
class Usuario
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function consulta()
    {
        $sql = "SELECT * FROM usuarios WHERE estado = 1 ORDER BY nombres";
        $res = mysqli_query($this->conexion, $sql) or die('No encontro la tabla usuarios');

        $vec = [];
        while ($row = mysqli_fetch_array($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT * FROM usuarios WHERE id_usuario = $id";
        $res = mysqli_query($this->conexion, $sql) or die('No se pudo buscar el usuario');

        $row = mysqli_fetch_array($res);
        return $row;
    }

    public function insertar($params)
    {
        try {
            $hash = password_hash($params->contrasena, PASSWORD_DEFAULT);

            $sql = "INSERT INTO usuarios (nombres, apellidos, tipo_documento, numero_documento, telefono, email, contraseña, rol, estado)
                VALUES ('$params->nombres', '$params->apellidos', '$params->tipo_documento', '$params->numero_documento', '$params->telefono', '$params->email', '$hash', '$params->rol', 1)";

            mysqli_query($this->conexion, $sql);

            $vec = [];
            $vec['resultado'] = "Ok";
            $vec['mensaje'] = "Se agrego el usuario";

        } catch (mysqli_sql_exception $e) {
            $vec = [];
            $vec['resultado'] = "Error";

            if (strpos($e->getMessage(), 'numero_documento') !== false) {
                $vec['mensaje'] = "Ese número de documento ya está registrado";
            } elseif (strpos($e->getMessage(), 'email') !== false) {
                $vec['mensaje'] = "Ese email ya está registrado";
            } else {
                $vec['mensaje'] = "No se pudo agregar el usuario";
            }
        }

        return $vec;
    }

    public function editar($id, $params)
    {
        $sql = "UPDATE usuarios SET
                    nombres = '$params->nombres',
                    apellidos = '$params->apellidos',
                    tipo_documento = '$params->tipo_documento',
                    numero_documento = '$params->numero_documento',
                    telefono = '$params->telefono',
                    email = '$params->email',
                    rol = '$params->rol'
                WHERE id_usuario = $id";

        mysqli_query($this->conexion, $sql) or die('No se pudo editar el usuario');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Se edito el usuario";

        return $vec;
    }

    public function eliminar($id)
    {
        $sql = "UPDATE usuarios SET estado = 0 WHERE id_usuario = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo eliminar el usuario');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Usuario eliminado correctamente";

        return $vec;
    }

    public function cambiarPassword($id, $params)
    {
        $hash = password_hash($params->contrasena, PASSWORD_DEFAULT);

        $sql = "UPDATE usuarios SET contraseña = '$hash' WHERE id_usuario = $id";
        mysqli_query($this->conexion, $sql) or die('No se pudo cambiar la contraseña');

        $vec = [];
        $vec['resultado'] = "Ok";
        $vec['mensaje'] = "Contraseña actualizada correctamente";

        return $vec;
    }
}
