CREATE DATABASE  IF NOT EXISTS `cpg` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cpg`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cpg
-- ------------------------------------------------------
-- Server version	8.0.22

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
  `codigo_asignado` tinyint NOT NULL DEFAULT '0',
  `id_user_afiliacion` int DEFAULT NULL,
  `fecha_activacion` datetime DEFAULT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `fecha_expiracion` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`codigo_afiliacion`),
  KEY `fk_afiliacion_user1_idx` (`id_user_afiliacion`),
  CONSTRAINT `fk_afiliacion_user1` FOREIGN KEY (`id_user_afiliacion`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `afiliacion`
--

LOCK TABLES `afiliacion` WRITE;
/*!40000 ALTER TABLE `afiliacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `afiliacion` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
INSERT INTO `ciudad` VALUES (4,'Barranquilla'),(1,'Bogotá'),(3,'Cali'),(2,'Medellín');
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establecimiento`
--

DROP TABLE IF EXISTS `establecimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establecimiento` (
  `id_establecimiento` int NOT NULL AUTO_INCREMENT,
  `nit_establecimiento` bigint NOT NULL,
  `nombre_establecimiento` varchar(50) NOT NULL,
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
  PRIMARY KEY (`id_establecimiento`),
  UNIQUE KEY `nombre_empresa_UNIQUE` (`nombre_establecimiento`),
  UNIQUE KEY `correo_establecimiento_UNIQUE` (`correo_establecimiento`),
  UNIQUE KEY `nit_UNIQUE` (`nit_establecimiento`),
  UNIQUE KEY `id_establecimiento_UNIQUE` (`id_establecimiento`),
  UNIQUE KEY `logo_establecimiento_UNIQUE` (`logo_establecimiento`),
  KEY `fk_establecimiento_ciudad1_idx` (`ciudad_id_ciudad`),
  CONSTRAINT `fk_establecimiento_ciudad1` FOREIGN KEY (`ciudad_id_ciudad`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establecimiento`
--

LOCK TABLES `establecimiento` WRITE;
/*!40000 ALTER TABLE `establecimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `establecimiento` ENABLE KEYS */;
UNLOCK TABLES;

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
  `id_establecimiento_experiencia` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_experiencia`),
  UNIQUE KEY `imagen_experiencia_UNIQUE` (`imagen_experiencia`),
  KEY `fk_experiencia_experiencia_tipo1_idx` (`experiencia_tipo_id_tipo`),
  KEY `fk_experiencia_establecimiento1_idx` (`id_establecimiento_experiencia`),
  CONSTRAINT `fk_experiencia_establecimiento1` FOREIGN KEY (`id_establecimiento_experiencia`) REFERENCES `establecimiento` (`id_establecimiento`),
  CONSTRAINT `fk_experiencia_experiencia_tipo1` FOREIGN KEY (`experiencia_tipo_id_tipo`) REFERENCES `experiencia_tipo` (`id_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia`
--

LOCK TABLES `experiencia` WRITE;
/*!40000 ALTER TABLE `experiencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencia` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `experiencia_tipo`
--

LOCK TABLES `experiencia_tipo` WRITE;
/*!40000 ALTER TABLE `experiencia_tipo` DISABLE KEYS */;
INSERT INTO `experiencia_tipo` VALUES (1,'Cenas Especiales'),(2,'Selección de Productos'),(3,'Bienestar');
/*!40000 ALTER TABLE `experiencia_tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencia_usada`
--

DROP TABLE IF EXISTS `experiencia_usada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencia_usada` (
  `id_experiencia_usada` bigint NOT NULL AUTO_INCREMENT,
  `id_user_experiencia_usada` int NOT NULL,
  `id_experiencia_experiencia_usada` int NOT NULL,
  `valor_comision` bigint NOT NULL,
  `fecha_uso_experiencia_usada` datetime NOT NULL,
  `renovado_experiencia_usada` tinyint NOT NULL DEFAULT '0',
  `cobrada_experiencia_usada` tinyint NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_experiencia_usada`,`id_user_experiencia_usada`,`id_experiencia_experiencia_usada`),
  KEY `fk_experiencia_usada_experiencia1_idx` (`id_experiencia_experiencia_usada`),
  KEY `fk_experiencia_usada_user1_idx` (`id_user_experiencia_usada`),
  CONSTRAINT `fk_experiencia_usada_experiencia` FOREIGN KEY (`id_experiencia_experiencia_usada`) REFERENCES `experiencia` (`id_experiencia`),
  CONSTRAINT `fk_experiencia_usada_user` FOREIGN KEY (`id_user_experiencia_usada`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia_usada`
--

LOCK TABLES `experiencia_usada` WRITE;
/*!40000 ALTER TABLE `experiencia_usada` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencia_usada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuente_pago`
--

DROP TABLE IF EXISTS `fuente_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuente_pago` (
  `id_fuente_pago` bigint NOT NULL,
  `acceptance_token` varchar(1000) NOT NULL,
  `customer_email` varchar(500) NOT NULL,
  `type` varchar(45) NOT NULL,
  `id_tarjeta_fuente_pago` varchar(200) NOT NULL,
  PRIMARY KEY (`id_fuente_pago`),
  KEY `fk_fuente_pago_tarjeta1_idx` (`id_tarjeta_fuente_pago`),
  CONSTRAINT `fk_fuente_pago_tarjeta1` FOREIGN KEY (`id_tarjeta_fuente_pago`) REFERENCES `tarjeta` (`id_tarjeta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuente_pago`
--

LOCK TABLES `fuente_pago` WRITE;
/*!40000 ALTER TABLE `fuente_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `fuente_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_establecimiento`
--

DROP TABLE IF EXISTS `historico_establecimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_establecimiento` (
  `id_establecimiento_historico` int NOT NULL,
  `procesados_total` int NOT NULL DEFAULT '0',
  `procesados_lote` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_establecimiento_historico`),
  CONSTRAINT `fk_historico_establecimiento` FOREIGN KEY (`id_establecimiento_historico`) REFERENCES `establecimiento` (`id_establecimiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_establecimiento`
--

LOCK TABLES `historico_establecimiento` WRITE;
/*!40000 ALTER TABLE `historico_establecimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `historico_establecimiento` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticia`
--

DROP TABLE IF EXISTS `noticia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticia` (
  `id_noticia` int NOT NULL AUTO_INCREMENT,
  `titulo_noticia` varchar(100) NOT NULL,
  `contenido_noticia` varchar(1000) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `imagen_noticia` varchar(100) DEFAULT NULL,
  `estado_noticia` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_noticia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticia`
--

LOCK TABLES `noticia` WRITE;
/*!40000 ALTER TABLE `noticia` DISABLE KEYS */;
/*!40000 ALTER TABLE `noticia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` bigint NOT NULL AUTO_INCREMENT,
  `total_monto` bigint NOT NULL,
  `id_establecimiento_pago` int NOT NULL,
  `pago_enviado` tinyint DEFAULT NULL,
  `fuente_pago_id_fuente_pago` bigint NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `id_transaction` varchar(100) DEFAULT NULL,
  `observacion_pago` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `fk_pago_establecimiento1_idx` (`id_establecimiento_pago`),
  KEY `fk_pago_fuente_pago1_idx` (`fuente_pago_id_fuente_pago`),
  CONSTRAINT `fk_pago_establecimiento1` FOREIGN KEY (`id_establecimiento_pago`) REFERENCES `establecimiento` (`id_establecimiento`),
  CONSTRAINT `fk_pago_fuente_pago1` FOREIGN KEY (`fuente_pago_id_fuente_pago`) REFERENCES `fuente_pago` (`id_fuente_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `periodo_afiliacion`
--

LOCK TABLES `periodo_afiliacion` WRITE;
/*!40000 ALTER TABLE `periodo_afiliacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `periodo_afiliacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL,
  `nombre_rol` varchar(45) NOT NULL,
  `interfaz_movil` tinyint NOT NULL,
  `interfaz_web` tinyint NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `id_rol_UNIQUE` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador',0,1),(2,'Usuario final',1,0),(3,'Administrador Establecimiento',1,0),(4,'Asistente Establecimiento',1,0);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarjeta`
--

DROP TABLE IF EXISTS `tarjeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarjeta` (
  `id_tarjeta` varchar(200) NOT NULL,
  `numero_tarjeta` varchar(16) NOT NULL,
  `cvc` varchar(3) NOT NULL,
  `exp_month` varchar(2) NOT NULL,
  `exp_year` varchar(2) NOT NULL,
  `card_holder` varchar(100) NOT NULL,
  `created_at` varchar(200) NOT NULL,
  `brand` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `last_four` varchar(4) NOT NULL,
  `bin` bigint NOT NULL,
  `expires_at` varchar(100) NOT NULL,
  `estado_tarjeta` tinyint NOT NULL DEFAULT '1',
  `id_establecimiento_tarjeta` int NOT NULL,
  PRIMARY KEY (`id_tarjeta`),
  KEY `fk_tarjeta_establecimiento1_idx` (`id_establecimiento_tarjeta`),
  CONSTRAINT `fk_tarjeta_establecimiento1` FOREIGN KEY (`id_establecimiento_tarjeta`) REFERENCES `establecimiento` (`id_establecimiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarjeta`
--

LOCK TABLES `tarjeta` WRITE;
/*!40000 ALTER TABLE `tarjeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarjeta` ENABLE KEYS */;
UNLOCK TABLES;

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
  `id_establecimiento_user` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `user_id_ciudad` int DEFAULT NULL,
  `user_direccion` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_user_rol1_idx` (`rol_id_rol`),
  KEY `fk_user_establecimiento1_idx` (`id_establecimiento_user`),
  CONSTRAINT `fk_user_establecimiento` FOREIGN KEY (`id_establecimiento_user`) REFERENCES `establecimiento` (`id_establecimiento`),
  CONSTRAINT `fk_user_rol` FOREIGN KEY (`rol_id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Administrador',NULL,'administrador@gmail.com','3000000000','$2a$10$SFn8J7UQu2jdXbE5/JNtkexY4BzpP6KI8UzXqwV91nRpT1Y78tYiS',1,1,NULL,'2020-08-07 09:00:21','2020-09-11 09:54:02',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `util`
--

LOCK TABLES `util` WRITE;
/*!40000 ALTER TABLE `util` DISABLE KEYS */;
INSERT INTO `util` VALUES (1,'Días de vencimiento de una afiliación','183'),(2,'Línea de WhatsApp','3150000000'),(3,'Link Chat de WhatsApp','https://api.whatsapp.com/send?phone=573192522839&text=Quiero%20soporte%20en%20la%20aplicaci%C3%B3n'),(4,'Version App Movil','1000');
/*!40000 ALTER TABLE `util` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-30 10:16:37
