<?php
    $servidor = "localhost";
    $usuario = "root";
    $clave = "";
    $bd = "sgtr";

        $conexion = mysqli_connect($servidor, $usuario, $clave, $bd) or die("No se conecto a mysql " );
        mysqli_select_db($conexion, $bd) or die("No se conecto a la base de datos SGTR");
        mysqli_set_charset($conexion, "utf8");
?>