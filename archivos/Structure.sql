-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cpg
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `afiliacion`
--

DROP TABLE IF EXISTS `afiliacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `afiliacion` (
  `codigo_afiliacion` varchar(8) NOT NULL,
  `asignada` tinyint NOT NULL DEFAULT '0',
  `user_id_user` int DEFAULT NULL,
  `fecha_uso` datetime DEFAULT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`codigo_afiliacion`),
  KEY `fk_afiliacion_user1_idx` (`user_id_user`),
  CONSTRAINT `fk_afiliacion_user1` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudad` (
  `id_ciudad` int NOT NULL AUTO_INCREMENT,
  `nombre_ciudad` varchar(20) NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  UNIQUE KEY `nombre_ciudad_UNIQUE` (`nombre_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `establecimiento`
--

DROP TABLE IF EXISTS `establecimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establecimiento` (
  `nit` bigint NOT NULL,
  `nombre_empresa` varchar(50) NOT NULL,
  `establecimiento_comercial` varchar(60) NOT NULL,
  `correo_establecimiento` varchar(60) NOT NULL,
  `celular_establecimiento` varchar(10) NOT NULL,
  `direccion_establecimiento` varchar(100) NOT NULL,
  `cantidad_lote` int NOT NULL,
  `autorizacion_datos` tinyint NOT NULL,
  `autorizacion_debito` tinyint NOT NULL,
  `logo_establecimiento` varchar(150) DEFAULT NULL,
  `estado_establecimiento` tinyint NOT NULL DEFAULT '1',
  `ciudad_id_ciudad` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`nit`),
  UNIQUE KEY `nombre_empresa_UNIQUE` (`nombre_empresa`),
  UNIQUE KEY `correo_establecimiento_UNIQUE` (`correo_establecimiento`),
  UNIQUE KEY `logo_establecimiento_UNIQUE` (`logo_establecimiento`),
  KEY `fk_establecimiento_ciudad1_idx` (`ciudad_id_ciudad`),
  CONSTRAINT `fk_establecimiento_ciudad1` FOREIGN KEY (`ciudad_id_ciudad`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `experiencia`
--

DROP TABLE IF EXISTS `experiencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencia` (
  `id_experiencia` int NOT NULL AUTO_INCREMENT,
  `titulo_experiencia` varchar(150) NOT NULL,
  `descripcion_experiencia` varchar(200) NOT NULL,
  `precio_experiencia` bigint NOT NULL,
  `precio_publico` bigint NOT NULL,
  `estado_experiencia` tinyint NOT NULL DEFAULT '0',
  `comision` decimal(5,2) NOT NULL,
  `imagen_experiencia` varchar(150) DEFAULT NULL,
  `experiencia_tipo_id_tipo` int NOT NULL,
  `establecimiento_nit` bigint NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_experiencia`),
  UNIQUE KEY `imagen_experiencia_UNIQUE` (`imagen_experiencia`),
  KEY `fk_experiencia_experiencia_tipo1_idx` (`experiencia_tipo_id_tipo`),
  KEY `fk_experiencia_establecimiento1_idx` (`establecimiento_nit`),
  CONSTRAINT `fk_experiencia_establecimiento1` FOREIGN KEY (`establecimiento_nit`) REFERENCES `establecimiento` (`nit`),
  CONSTRAINT `fk_experiencia_experiencia_tipo1` FOREIGN KEY (`experiencia_tipo_id_tipo`) REFERENCES `experiencia_tipo` (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `experiencia_tipo`
--

DROP TABLE IF EXISTS `experiencia_tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencia_tipo` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `tipo_experiencia` varchar(45) NOT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `experiencia_usada`
--

DROP TABLE IF EXISTS `experiencia_usada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencia_usada` (
  `id_experiencia_usada` int NOT NULL AUTO_INCREMENT,
  `user_id_user_usada` int NOT NULL,
  `experiencia_id_experiencia_usada` int NOT NULL,
  `fecha_uso_experiencia_usada` datetime NOT NULL,
  `renovado_experiencia_usada` tinyint NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_experiencia_usada`,`user_id_user_usada`,`experiencia_id_experiencia_usada`),
  KEY `fk_experiencia_usada_experiencia1_idx` (`experiencia_id_experiencia_usada`),
  KEY `fk_experiencia_usada_user1_idx` (`user_id_user_usada`),
  CONSTRAINT `fk_experiencia_usada_experiencia1` FOREIGN KEY (`experiencia_id_experiencia_usada`) REFERENCES `experiencia` (`id_experiencia`),
  CONSTRAINT `fk_experiencia_usada_user1` FOREIGN KEY (`user_id_user_usada`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historico_establecimiento`
--

DROP TABLE IF EXISTS `historico_establecimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_establecimiento` (
  `establecimiento_nit_historico` bigint NOT NULL,
  `procesados_total` int NOT NULL DEFAULT '0',
  `procesados_lote` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`establecimiento_nit_historico`),
  CONSTRAINT `fk_historico_establecimiento_establecimiento1` FOREIGN KEY (`establecimiento_nit_historico`) REFERENCES `establecimiento` (`nit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `titulo_item` varchar(100) NOT NULL,
  `descripcion_item` varchar(800) NOT NULL,
  `estado_item` tinyint NOT NULL DEFAULT '1',
  `experiencia_id_experiencia_item` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `fk_item_experiencia1_idx` (`experiencia_id_experiencia_item`),
  CONSTRAINT `fk_item_experiencia1` FOREIGN KEY (`experiencia_id_experiencia_item`) REFERENCES `experiencia` (`id_experiencia`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `noticia`
--

DROP TABLE IF EXISTS `noticia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticia` (
  `id_noticia` int NOT NULL AUTO_INCREMENT,
  `titulo_noticia` varchar(100) NOT NULL,
  `contenido_noticia` varchar(1500) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `imagen_noticia` varchar(100) DEFAULT NULL,
  `estado_noticia` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_noticia`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `periodo_afiliacion`
--

DROP TABLE IF EXISTS `periodo_afiliacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodo_afiliacion` (
  `afiliacion_codigo_afiliacion` varchar(8) NOT NULL,
  `periodo_afiliacion` int NOT NULL,
  `fecha_afiliacion` datetime NOT NULL,
  PRIMARY KEY (`afiliacion_codigo_afiliacion`,`periodo_afiliacion`),
  KEY `fk_periodo_afiliacion_afiliacion1_idx` (`afiliacion_codigo_afiliacion`),
  CONSTRAINT `fk_periodo_afiliacion_afiliacion1` FOREIGN KEY (`afiliacion_codigo_afiliacion`) REFERENCES `afiliacion` (`codigo_afiliacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL,
  `nombre_rol` varchar(45) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `id_rol_UNIQUE` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(100) NOT NULL,
  `numero_identificacion` bigint DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `numero_celular` varchar(10) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `estado_user` tinyint NOT NULL DEFAULT '1',
  `rol_id_rol` int NOT NULL DEFAULT '2',
  `establecimiento_nit_user` bigint DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_user_rol1_idx` (`rol_id_rol`),
  KEY `fk_user_establecimiento1_idx` (`establecimiento_nit_user`),
  CONSTRAINT `fk_user_establecimiento1` FOREIGN KEY (`establecimiento_nit_user`) REFERENCES `establecimiento` (`nit`),
  CONSTRAINT `fk_user_rol1` FOREIGN KEY (`rol_id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `util`
--

DROP TABLE IF EXISTS `util`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `util` (
  `id_param` int NOT NULL,
  `nombre_param` varchar(45) NOT NULL,
  `valor_param` varchar(500) NOT NULL,
  PRIMARY KEY (`id_param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-07 16:59:43
