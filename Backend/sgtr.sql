-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-07-2026 a las 17:40:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sgtr`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Camisetas', 'Prendas superiores de uso casual.', 1),
(2, 'Pantalones', 'Jeans, joggers y pantalones de vestir.', 1),
(3, 'Vestidos', 'Vestidos para diferentes ocasiones.', 1),
(4, 'Calzado', 'Zapatos, tenis y sandalias.', 1),
(5, 'Accesorios', 'Gorras, cinturones, bolsos y otros accesorios.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `identificacion` varchar(20) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `identificacion`, `nombre`, `telefono`, `email`, `direccion`, `ciudad`, `estado`, `fecha_registro`) VALUES
(1, '101001001', 'Juan Carlos Pérez', '3101112233', 'juan.perez@gmail.com', 'Cra 10 #20-30', 'Cartagena', 1, '2026-06-30 21:45:25'),
(2, '101001002', 'María Fernanda Gómez', '3102223344', 'maria.gomez@gmail.com', 'Cra 15 #25-40', 'Cartagena', 1, '2026-06-30 21:45:25'),
(3, '101001003', 'Luis Alberto Rodríguez', '3103334455', 'luis.rodriguez@gmail.com', 'Calle 30 #40-15', 'Barranquilla', 1, '2026-06-30 21:45:25'),
(4, '101001004', 'Laura Sofía Martínez', '3104445566', 'laura.martinez@gmail.com', 'Av. Pedro de Heredia #50-20', 'Cartagena', 1, '2026-06-30 21:45:25'),
(5, '101001005', 'Andrés Felipe Díaz', '3105556677', 'andres.diaz@gmail.com', 'Cra 8 #18-12', 'Sincelejo', 1, '2026-06-30 21:45:25'),
(12, '2314562234214', 'Manolo', '3153452321', '', '', '', 1, '2026-07-16 13:28:38'),
(13, '10987234', 'paolo Hernandez', '123456789', 'paolito@gmail.com', 'Caracoles', 'Medellin', 0, '2026-07-17 14:11:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `numero_compra` varchar(20) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(12,2) NOT NULL,
  `estado` enum('Pendiente','Completada','Cancelada') NOT NULL DEFAULT 'Completada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id_compra`, `numero_compra`, `id_proveedor`, `id_usuario`, `fecha`, `total`, `estado`) VALUES
(1, 'COMP0001', 1, 1, '2026-06-25 09:30:00', 1980000.00, 'Completada'),
(2, 'COMP0002', 2, 1, '2026-06-26 10:15:00', 1400000.00, 'Completada'),
(3, 'COMP0003', 3, 2, '2026-06-27 11:00:00', 1250000.00, 'Completada'),
(4, 'COMP0004', 4, 1, '2026-06-28 14:20:00', 1800000.00, 'Completada'),
(5, 'COMP0005', 5, 2, '2026-06-29 09:45:00', 960000.00, 'Completada'),
(7, 'COMP0006', 2, 1, '2026-07-18 11:46:48', 50000.00, 'Cancelada'),
(10, 'COMP0007', 2, 1, '2026-07-18 12:37:04', 50000.00, 'Completada'),
(11, 'COMP0008', 4, 13, '2026-07-24 14:31:58', 250000.00, 'Cancelada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `id_configuracion` int(11) NOT NULL,
  `nombre_tienda` varchar(150) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `moneda` varchar(10) NOT NULL DEFAULT 'COP',
  `iva` decimal(5,2) NOT NULL DEFAULT 19.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`id_configuracion`, `nombre_tienda`, `nit`, `email`, `telefono`, `direccion`, `moneda`, `iva`) VALUES
(1, 'Tienda de Ropa SGTR', '900.123.456-7', 'contacto@sgtr.com', '+1 234 567 8900', 'Cra 10 #20-30, Cartagena', 'COP', 19.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id_detalle_compra` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detalle_compra`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 1, 1, 20, 45000.00, 900000.00),
(2, 1, 4, 6, 180000.00, 1080000.00),
(3, 2, 2, 10, 90000.00, 900000.00),
(4, 2, 5, 20, 25000.00, 500000.00),
(5, 3, 5, 50, 25000.00, 1250000.00),
(6, 4, 2, 20, 90000.00, 1800000.00),
(7, 5, 3, 8, 120000.00, 960000.00),
(10, 7, 22, 1, 50000.00, 50000.00),
(11, 10, 22, 1, 50000.00, 50000.00),
(12, 11, 22, 4, 50000.00, 200000.00),
(13, 11, 5, 2, 25000.00, 50000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id_detalle_venta`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 1, 1, 2, 85000.00, 170000.00),
(2, 1, 5, 1, 50000.00, 50000.00),
(3, 2, 3, 1, 220000.00, 220000.00),
(4, 2, 2, 1, 160000.00, 160000.00),
(5, 2, 5, 2, 50000.00, 100000.00),
(6, 3, 4, 1, 320000.00, 320000.00),
(7, 4, 1, 1, 85000.00, 85000.00),
(8, 4, 2, 1, 160000.00, 160000.00),
(9, 4, 5, 1, 50000.00, 50000.00),
(10, 5, 3, 1, 220000.00, 220000.00),
(11, 5, 4, 1, 320000.00, 320000.00),
(12, 5, 5, 2, 50000.00, 100000.00),
(13, 6, 1, 2, 90000.00, 180000.00),
(14, 6, 10, 2, 180000.00, 360000.00),
(15, 7, 1, 1, 90000.00, 90000.00),
(16, 8, 22, 1, 60000.00, 60000.00),
(17, 9, 22, 1, 60000.00, 60000.00),
(18, 10, 22, 2, 60000.00, 120000.00),
(19, 12, 22, 1, 60000.00, 60000.00),
(20, 13, 2, 1, 160000.00, 160000.00),
(21, 14, 22, 2, 60000.00, 120000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `id_marca` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`id_marca`, `nombre`, `estado`) VALUES
(1, 'Nike', 1),
(2, 'Adidas', 1),
(3, 'Puma', 1),
(4, 'Levis', 1),
(5, 'Studio F', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id_movimiento` int(11) NOT NULL,
  `tipo` enum('Entrada','Salida') NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `referencia` varchar(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_inventario`
--

INSERT INTO `movimientos_inventario` (`id_movimiento`, `tipo`, `id_producto`, `cantidad`, `fecha`, `id_usuario`, `referencia`, `descripcion`) VALUES
(1, 'Entrada', 1, 20, '2026-06-25 09:30:00', 1, 'COMP001', 'Ingreso de camisetas'),
(2, 'Entrada', 4, 6, '2026-06-25 09:30:00', 1, 'COMP001', 'Ingreso de tenis'),
(3, 'Entrada', 2, 10, '2026-06-26 10:15:00', 1, 'COMP002', 'Ingreso de jeans'),
(4, 'Entrada', 5, 20, '2026-06-26 10:15:00', 1, 'COMP002', 'Ingreso de gorras'),
(5, 'Entrada', 5, 50, '2026-06-27 11:00:00', 2, 'COMP003', 'Ingreso de gorras'),
(6, 'Entrada', 2, 20, '2026-06-28 14:20:00', 1, 'COMP004', 'Ingreso de jeans'),
(7, 'Entrada', 3, 8, '2026-06-29 09:45:00', 2, 'COMP005', 'Ingreso de vestidos'),
(8, 'Salida', 1, 2, '2026-06-30 10:15:00', 1, 'VTA001', 'Venta de camisetas'),
(9, 'Salida', 5, 1, '2026-06-30 10:15:00', 1, 'VTA001', 'Venta de gorra'),
(10, 'Salida', 3, 1, '2026-07-01 14:40:00', 2, 'VTA002', 'Venta de vestido'),
(11, 'Salida', 2, 1, '2026-07-01 14:40:00', 2, 'VTA002', 'Venta de jean'),
(12, 'Salida', 5, 2, '2026-07-01 14:40:00', 2, 'VTA002', 'Venta de gorras'),
(13, 'Salida', 4, 1, '2026-07-02 11:20:00', 1, 'VTA003', 'Venta de tenis'),
(14, 'Salida', 1, 1, '2026-07-03 16:00:00', 2, 'VTA004', 'Venta de camiseta'),
(15, 'Salida', 2, 1, '2026-07-03 16:00:00', 2, 'VTA004', 'Venta de jean'),
(16, 'Salida', 5, 1, '2026-07-03 16:00:00', 2, 'VTA004', 'Venta de gorra'),
(17, 'Salida', 3, 1, '2026-07-04 09:45:00', 1, 'VTA005', 'Venta de vestido'),
(18, 'Salida', 4, 1, '2026-07-04 09:45:00', 1, 'VTA005', 'Venta de tenis'),
(19, 'Salida', 5, 2, '2026-07-04 09:45:00', 1, 'VTA005', 'Venta de gorras'),
(20, 'Salida', 1, 2, '2026-07-12 11:11:24', 6, 'Venta #6', 'Salida por venta'),
(21, 'Salida', 10, 2, '2026-07-12 11:11:24', 6, 'Venta #6', 'Salida por venta'),
(22, 'Salida', 1, 1, '2026-07-16 13:30:13', 2, 'Venta #7', 'Salida por venta'),
(23, 'Entrada', 1, 2, '2026-07-17 12:20:49', 1, 'Compra #6', 'Entrada por compra'),
(24, 'Entrada', 22, 1, '2026-07-17 12:20:49', 1, 'Compra #6', 'Entrada por compra'),
(25, 'Salida', 22, 1, '2026-07-17 13:12:14', 1, 'Venta #8', 'Salida por venta'),
(26, 'Entrada', 22, 1, '2026-07-18 11:46:48', 1, 'Compra #7', 'Entrada por compra'),
(27, 'Salida', 22, 1, '2026-07-18 11:57:01', 1, 'Cancelación Compra #', 'Reversión por cancelación de compra'),
(28, 'Salida', 22, 1, '2026-07-18 11:59:16', 1, 'Venta #9', 'Salida por venta'),
(29, 'Entrada', 22, 1, '2026-07-18 12:02:42', 1, 'Cancelación Venta #9', 'Reversión por cancelación de venta'),
(30, 'Salida', 22, 2, '2026-07-18 12:13:24', 1, 'Venta #10', 'Salida por venta'),
(31, 'Entrada', 22, 2, '2026-07-18 12:14:28', 1, 'Canc. C#10', 'Reversión por cancelación de venta'),
(32, 'Entrada', 22, 1, '2026-07-18 12:37:05', 1, 'Compra #10', 'Entrada por compra'),
(33, 'Salida', 22, 1, '2026-07-18 12:39:09', 1, 'Venta #12', 'Salida por venta'),
(34, 'Salida', 2, 1, '2026-07-18 12:56:25', 2, 'Venta #13', 'Salida por venta'),
(35, 'Salida', 22, 2, '2026-07-22 13:34:54', 13, 'Venta #14', 'Salida por venta'),
(36, 'Entrada', 22, 4, '2026-07-24 14:31:58', 13, 'Compra #11', 'Entrada por compra'),
(37, 'Entrada', 5, 2, '2026-07-24 14:31:58', 13, 'Compra #11', 'Entrada por compra'),
(38, 'Salida', 22, 4, '2026-07-24 14:32:54', 13, 'Canc. C#11', 'Reversión por cancelación de compra'),
(39, 'Salida', 5, 2, '2026-07-24 14:32:54', 13, 'Canc. C#11', 'Reversión por cancelación de compra');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_marca` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `genero` enum('Hombre','Mujer','Unisex') NOT NULL,
  `color` varchar(50) NOT NULL,
  `material` varchar(100) DEFAULT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo`, `nombre`, `id_categoria`, `id_marca`, `id_proveedor`, `genero`, `color`, `material`, `precio_compra`, `precio_venta`, `stock`, `estado`) VALUES
(1, 'CAM001', 'Camiseta Deportiva Nike', 1, 1, 1, 'Hombre', 'Negro', 'Poliéster', 45000.00, 90000.00, 20, 1),
(2, 'PAN001', 'Jean Levis 501', 2, 4, 4, 'Hombre', 'Azul', 'Denim', 90000.00, 160000.00, 14, 1),
(3, 'VES001', 'Vestido Elegante Studio F', 3, 5, 5, 'Mujer', 'Rojo', 'Algodón', 120000.00, 220000.00, 10, 1),
(4, 'CAL001', 'Tenis Adidas Run', 4, 2, 2, 'Unisex', 'Blanco', 'Sintético', 180000.00, 320000.00, 12, 1),
(5, 'ACC001', 'Gorra Puma', 5, 3, 3, 'Unisex', 'Negro', 'Algodón', 25000.00, 50000.00, 30, 1),
(10, 'CAL002', 'Sport Premium', 4, 2, 2, 'Unisex', 'Blanco', 'Algodon', 150000.00, 180000.00, 14, 1),
(22, 'PAN056', 'Pantaloneta', 2, 2, 2, 'Hombre', 'Blanco', '', 50000.00, 60000.00, 8, 1),
(24, 'CAM003', 'Sueter', 1, 1, 1, 'Unisex', 'NEGRO', '', 50000.00, 60000.00, 10, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `nit`, `telefono`, `email`, `direccion`, `ciudad`, `estado`) VALUES
(1, 'Nike Colombia S.A.S.', '900123456-1', '3001234567', 'contacto@nike.com', 'Av. El Poblado #10-20', 'Medellín', 1),
(2, 'Adidas Colombia Ltda.', '900234567-2', '3002345678', 'ventas@adidas.com', 'Calle 80 #45-30', 'Bogotá', 1),
(3, 'Puma Colombia S.A.S.', '900345678-3', '3003456789', 'info@puma.com', 'Carrera 50 #20-15', 'Cali', 1),
(4, 'Levis Colombia S.A.', '900456789-4', '3004567890', 'comercial@levis.com', 'Av. Las Américas #15-40', 'Barranquilla', 1),
(5, 'Studio F S.A.S.', '900567890-5', '3005678901', 'servicio@studiof.com', 'Centro Comercial Caribe Plaza', 'Cartagena', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `tipo_documento` enum('CC','TI','CE','Pasaporte') NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('Administrador','Vendedor') NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombres`, `apellidos`, `tipo_documento`, `numero_documento`, `telefono`, `email`, `contraseña`, `rol`, `estado`, `fecha_registro`) VALUES
(1, 'Carlos', 'Pérez', 'CC', '1001234567', '3001112233', 'carlos.perez@sgtr.com', '$2y$10$3Z6UVyP4jVGn8avsBQ.GMOI1XVmotUtQu.j5T3RscRq23GxTbhsDe', 'Administrador', 1, '2026-06-30 21:44:52'),
(2, 'Laura', 'Gómez', 'CC', '1002345678', '3002223344', 'laura.gomez@sgtr.com', '$2y$10$jxnrQWuMFCYL4XFhTLtUQuWIYYdO6cIuDKygLUMqYOkF0gKLIA.gq', 'Vendedor', 1, '2026-06-30 21:44:52'),
(3, 'Andrés', 'Martínez', 'CC', '1003456789', '3003334455', 'andres.martinez@sgtr.com', '$2y$10$1WE0mVrR618jc9GR13uGRukhrUYJAsTpDQzyffzNkJnTcejCxU75i', 'Vendedor', 1, '2026-06-30 21:44:52'),
(4, 'María', 'Rodríguez', 'CC', '1004567890', '3004445566', 'maria.rodriguez@sgtr.com', '$2y$10$0vj8eMjl3DUspLvzApHyXuJmUyTJ/6cWmQ.flYAtmROVbzWN3u8yq', 'Vendedor', 1, '2026-06-30 21:44:52'),
(5, 'Juan', 'López', 'CC', '1005678901', '3005556677', 'juan.lopez@sgtr.com', '$2y$10$gEeaAOcuISD9St59xjocUuX8a7XvxnJZ4SYhOmH0oA7m1U50o5rkO', 'Administrador', 0, '2026-06-30 21:44:52'),
(6, 'Noah', 'Kartel', 'CC', '1007926122', '321456786', 'mono_flow1992@hotmail.com', '$2y$10$oZ9kuVr7LgKbdcL3RrzYW.UHb1L0XMPjiSj7y2d8CVh31YZFJjeIK', 'Vendedor', 1, '2026-07-12 11:05:21'),
(13, 'Joaquín Emilio', 'Becerra Amador', 'CC', '1007432456', '3008272354', 'joaquinbecerra002@gmail.com', '$2y$10$o0S4Kwiv0cj9IUDU83W51OyKR0Bu29k/shW6PtX3sq.fHEvy6Zwki', 'Administrador', 1, '2026-07-21 09:45:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `numero_venta` varchar(20) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(12,2) NOT NULL,
  `descuento` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `metodo_pago` enum('Efectivo','Tarjeta Débito','Tarjeta Crédito','Nequi','Transferencia') NOT NULL,
  `estado` enum('Completada','Cancelada') NOT NULL DEFAULT 'Completada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `numero_venta`, `id_cliente`, `id_usuario`, `fecha`, `subtotal`, `descuento`, `total`, `metodo_pago`, `estado`) VALUES
(1, 'VTA0001', 1, 1, '2026-06-30 10:15:00', 220000.00, 0.00, 220000.00, 'Nequi', 'Completada'),
(2, 'VTA0002', 2, 2, '2026-07-01 14:40:00', 480000.00, 10000.00, 470000.00, 'Tarjeta Débito', 'Completada'),
(3, 'VTA0003', 3, 1, '2026-07-02 11:20:00', 320000.00, 0.00, 320000.00, 'Efectivo', 'Completada'),
(4, 'VTA0004', 4, 2, '2026-07-03 16:00:00', 270000.00, 20000.00, 250000.00, 'Transferencia', 'Completada'),
(5, 'VTA0005', 5, 1, '2026-07-04 09:45:00', 420000.00, 20000.00, 400000.00, 'Tarjeta Crédito', 'Completada'),
(6, 'VTA0006', 4, 6, '2026-07-12 11:11:24', 540000.00, 20.00, 539980.00, 'Tarjeta Crédito', 'Completada'),
(7, 'VTA0007', 12, 2, '2026-07-16 13:30:13', 90000.00, 20.00, 89980.00, 'Transferencia', 'Completada'),
(8, 'VTA0008', 12, 1, '2026-07-17 13:12:14', 60000.00, 0.00, 60000.00, 'Efectivo', 'Completada'),
(9, 'VTA0009', 5, 1, '2026-07-18 11:59:16', 60000.00, 0.00, 60000.00, 'Transferencia', 'Cancelada'),
(10, 'VTA0010', 12, 1, '2026-07-18 12:13:24', 120000.00, 0.00, 120000.00, 'Tarjeta Débito', 'Cancelada'),
(12, 'VTA0012', 2, 1, '2026-07-18 12:39:09', 60000.00, 0.00, 60000.00, 'Tarjeta Crédito', 'Completada'),
(13, 'VTA0013', 3, 2, '2026-07-18 12:56:25', 160000.00, 0.00, 160000.00, 'Efectivo', 'Completada'),
(14, 'VTA0014', 12, 13, '2026-07-22 13:34:54', 120000.00, 20000.00, 100000.00, 'Efectivo', 'Completada');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `identificacion` (`identificacion`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`),
  ADD UNIQUE KEY `numero_compra` (`numero_compra`),
  ADD KEY `fk_compra_proveedor` (`id_proveedor`),
  ADD KEY `fk_compra_usuario` (`id_usuario`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id_configuracion`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id_detalle_compra`),
  ADD KEY `fk_detalle_compra_compra` (`id_compra`),
  ADD KEY `fk_detalle_compra_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD KEY `fk_detalle_venta_venta` (`id_venta`),
  ADD KEY `fk_detalle_venta_producto` (`id_producto`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id_marca`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `fk_movimiento_producto` (`id_producto`),
  ADD KEY `fk_movimiento_usuario` (`id_usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `fk_producto_categoria` (`id_categoria`),
  ADD KEY `fk_producto_marca` (`id_marca`),
  ADD KEY `fk_producto_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD UNIQUE KEY `nit` (`nit`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `numero_documento` (`numero_documento`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD UNIQUE KEY `numero_venta` (`numero_venta`),
  ADD KEY `fk_venta_cliente` (`id_cliente`),
  ADD KEY `fk_venta_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `id_configuracion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detalle_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `fk_compra_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `fk_compra_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `fk_detalle_compra_compra` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  ADD CONSTRAINT `fk_detalle_compra_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `fk_detalle_venta_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `fk_detalle_venta_venta` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`);

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `fk_movimiento_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `fk_movimiento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `fk_producto_marca` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id_marca`),
  ADD CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `fk_venta_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `fk_venta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
