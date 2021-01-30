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
INSERT INTO `afiliacion` VALUES ('AP3AUAOP',1,5,'2021-01-30 11:07:36','2021-08-01 23:59:59',NULL,'2021-01-30 16:07:07','2021-01-30 16:07:36'),('B7WSAGGB',1,6,'2021-01-30 11:08:47','2021-08-01 23:59:59',NULL,'2021-01-30 16:07:07','2021-01-30 16:08:47'),('DSG0XEWH',1,7,'2021-01-30 11:09:48','2021-08-01 23:59:59',NULL,'2021-01-30 16:07:07','2021-01-30 16:09:48'),('L2Z5WMI2',1,NULL,NULL,NULL,NULL,'2021-01-30 16:07:07','2021-01-30 16:07:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establecimiento`
--

LOCK TABLES `establecimiento` WRITE;
/*!40000 ALTER TABLE `establecimiento` DISABLE KEYS */;
INSERT INTO `establecimiento` VALUES (1,123456789,'Establecimiento 1','Establecimiento de prueba','establecimiento1@gmail.com','3152090300','CRA 1 CALLE 1 - 1',45,1,1,'/establecimiento/1.png',1,1,'2021-01-30 15:20:10','2021-01-30 15:20:10'),(2,223456789,'Establecimiento 2','Establecimiento de prueba','establecimiento2@gmail.com','3152090301','CRA 1 CALLE 1 - 2',45,1,1,'/establecimiento/2.jpeg',1,1,'2021-01-30 15:23:12','2021-01-30 15:23:12'),(3,323456789,'Establecimiento 3','Establecimiento de prueba','establecimiento3@gmail.com','3152090302','CRA 1 CALLE 1 - 3',45,1,1,'/establecimiento/3.jpeg',1,1,'2021-01-30 15:23:51','2021-01-30 15:23:51');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia`
--

LOCK TABLES `experiencia` WRITE;
/*!40000 ALTER TABLE `experiencia` DISABLE KEYS */;
INSERT INTO `experiencia` VALUES (1,'Prueba experiencia 1','prueba ',100000,140000,1,30.00,'/experiencias/1.jpeg',1,1,'2021-01-30 15:30:23','2021-01-30 15:30:49'),(2,'Prueba experiencia 2','prueba ',10000,14000,1,50.00,'/experiencias/2.jpeg',2,2,'2021-01-30 15:35:43','2021-01-30 15:35:55'),(3,'Prueba experiencia 3','prueba ',80000,100000,1,20.00,'/experiencias/3.jpeg',3,3,'2021-01-30 15:39:36','2021-01-30 15:39:36'),(4,'Prueba experiencia 4','prueba ',85000,150000,1,26.50,'/experiencias/4.jpeg',3,1,'2021-01-30 15:42:20','2021-01-30 15:42:20'),(5,'Prueba experiencia 5','prueba ',85000,150000,1,26.56,'/experiencias/5.jpeg',2,2,'2021-01-30 15:43:28','2021-01-30 15:43:28'),(6,'Prueba experiencia 6','prueba ',85000,150000,1,26.56,'/experiencias/6.jpeg',1,3,'2021-01-30 15:44:07','2021-01-30 15:44:07');
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
  `valor_comision` decimal(10,2) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia_usada`
--

LOCK TABLES `experiencia_usada` WRITE;
/*!40000 ALTER TABLE `experiencia_usada` DISABLE KEYS */;
INSERT INTO `experiencia_usada` VALUES (1,7,1,30000.00,'2021-01-30 11:29:34',0,1,'2021-01-30 16:29:34','2021-01-30 16:47:01'),(2,7,4,22525.00,'2021-01-30 11:31:11',0,1,'2021-01-30 16:31:11','2021-01-30 16:47:01'),(3,7,2,5000.00,'2021-01-30 11:33:36',0,1,'2021-01-30 16:33:36','2021-01-30 16:44:01'),(4,7,5,22576.00,'2021-01-30 11:33:47',0,1,'2021-01-30 16:33:47','2021-01-30 16:44:01'),(5,7,6,22576.00,'2021-01-30 11:34:49',0,1,'2021-01-30 16:34:49','2021-01-30 16:38:06'),(6,7,3,16000.00,'2021-01-30 11:35:03',0,1,'2021-01-30 16:35:03','2021-01-30 16:38:06'),(7,5,6,22576.00,'2021-01-30 11:36:24',0,1,'2021-01-30 16:36:24','2021-01-30 16:38:06'),(8,5,3,16000.00,'2021-01-30 11:36:48',0,1,'2021-01-30 16:36:48','2021-01-30 16:38:06'),(9,5,2,5000.00,'2021-01-30 11:43:15',0,0,'2021-01-30 16:43:15','2021-01-30 16:44:01'),(10,5,1,30000.00,'2021-01-30 11:46:43',0,0,'2021-01-30 16:46:43','2021-01-30 16:47:01');
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
INSERT INTO `fuente_pago` VALUES (7612,'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MTIwMjA1NjQtNzA3NTAiLCJleHAiOjE2MTIwMjQxNjR9.exNP4GkmAoctGSNdqlpkq2yAFlgYOe6zSHjPVncixZQ','adminprueba1@gmail.com','CARD','tok_test_9401_5038692586375bBA911b6e48F25a6E10'),(7613,'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MTIwMjA4OTUtMjIzMjYiLCJleHAiOjE2MTIwMjQ0OTV9.JsdlrRpquXj-uMoI01RhNz22mFJuJLYlxh4fYXc4re4','adminprueba2@gmail.com','CARD','tok_test_9401_27Cd1257e5ab2B93442b9f11d48baB91'),(7614,'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MTIwMjExMzUtMTQ5NzYiLCJleHAiOjE2MTIwMjQ3MzV9.DNR1aKUUgeBfjiLGXDmZ9KT2EcAUuiVKCpWsXA_ne24','adminprueba3@gmail.com','CARD','tok_test_9401_f099d11ed9C1d224c97c3c5EC1B1011D');
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
INSERT INTO `historico_establecimiento` VALUES (1,0,0),(2,0,0),(3,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Seleccion de producto 1','Descripcion 1',1,1,'2021-01-30 15:32:27','2021-01-30 15:32:27'),(2,'Seleccion de producto 2','Descripcion 2',1,1,'2021-01-30 15:32:33','2021-01-30 15:32:33'),(3,'Seleccion de producto 3','Descripcion 3',1,1,'2021-01-30 15:32:39','2021-01-30 15:32:39'),(4,'Seleccion de producto 4','Descripcion 4',1,1,'2021-01-30 15:32:44','2021-01-30 15:32:44'),(5,'Seleccion de producto 1','Descripcion 1',1,2,'2021-01-30 15:36:16','2021-01-30 15:36:16'),(6,'Seleccion de producto 2','Descripcion 2',1,2,'2021-01-30 15:36:22','2021-01-30 15:36:22'),(7,'Seleccion de producto 1','Descripcion 1',1,3,'2021-01-30 15:39:55','2021-01-30 15:39:55'),(8,'Seleccion de producto 2','Descripcion 2',1,3,'2021-01-30 15:40:02','2021-01-30 15:40:02'),(9,'Seleccion de producto 3','Descripcion 3',1,3,'2021-01-30 15:40:07','2021-01-30 15:40:07'),(10,'Seleccion de producto 4','Descripcion 4',1,3,'2021-01-30 15:40:12','2021-01-30 15:40:12'),(11,'Seleccion de producto 1','Descripcion 1',1,4,'2021-01-30 15:42:50','2021-01-30 15:42:50'),(12,'Seleccion de producto 1','Descripcion 1',1,5,'2021-01-30 15:43:35','2021-01-30 15:43:35'),(13,'Seleccion de producto 1','Descripcion 1',1,6,'2021-01-30 15:44:11','2021-01-30 15:44:11');
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
  `total_monto` decimal(10,2) NOT NULL,
  `id_establecimiento_pago` int NOT NULL,
  `pago_enviado` tinyint DEFAULT NULL,
  `fuente_pago_id_fuente_pago` bigint NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `id_transaction` varchar(100) DEFAULT NULL,
  `observacion_pago` varchar(100) DEFAULT NULL,
  `pago_aceptado` tinyint DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `fk_pago_establecimiento1_idx` (`id_establecimiento_pago`),
  KEY `fk_pago_fuente_pago1_idx` (`fuente_pago_id_fuente_pago`),
  CONSTRAINT `fk_pago_establecimiento1` FOREIGN KEY (`id_establecimiento_pago`) REFERENCES `establecimiento` (`id_establecimiento`),
  CONSTRAINT `fk_pago_fuente_pago1` FOREIGN KEY (`fuente_pago_id_fuente_pago`) REFERENCES `fuente_pago` (`id_fuente_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,52525.00,1,1,7612,'2021-01-30 16:38:00','2021-01-30 16:38:06','19401-1612024659-10999','PAGO REALIZADO CORRECTAMENTE',NULL),(2,77152.00,3,1,7614,'2021-01-30 16:38:00','2021-01-30 16:38:06','19401-1612024659-82697','PAGO REALIZADO CORRECTAMENTE',NULL),(3,27576.00,2,1,7613,'2021-01-30 16:38:00','2021-01-30 16:38:01','19401-1612024654-72512','PAGO REALIZADO CORRECTAMENTE',NULL),(4,5000.00,2,1,7613,'2021-01-30 16:44:00','2021-01-30 16:44:01','19401-1612025014-48528','PAGO REALIZADO CORRECTAMENTE',NULL),(5,30000.00,1,1,7612,'2021-01-30 16:47:00','2021-01-30 16:47:01','19401-1612025194-77742','PAGO REALIZADO CORRECTAMENTE',NULL),(6,30000.00,1,1,7612,'2021-01-30 20:04:00','2021-01-30 20:04:01','19401-1612037014-61109','ENVIADO A LA PASARELA DE PAGOS',NULL),(7,5000.00,2,1,7613,'2021-01-30 20:04:00','2021-01-30 20:04:07','19401-1612037020-95850','ENVIADO A LA PASARELA DE PAGOS',NULL);
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
INSERT INTO `periodo_afiliacion` VALUES ('AP3AUAOP',1,'2021-01-30 11:07:36'),('B7WSAGGB',1,'2021-01-30 11:08:47'),('DSG0XEWH',1,'2021-01-30 11:09:48');
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
INSERT INTO `tarjeta` VALUES ('tok_test_9401_27Cd1257e5ab2B93442b9f11d48baB91','4111111111111111','789','12','29','Admin Prueba 2','2021-01-30T15:34:55.551+00:00','VISA','VISA-1111','1111',411111,'2021-07-29T15:34:55.000Z',1,2),('tok_test_9401_5038692586375bBA911b6e48F25a6E10','4242424242424242','789','12','29','Admin Prueba','2021-01-30T15:29:23.841+00:00','VISA','VISA-4242','4242',424242,'2021-07-29T15:29:23.000Z',1,1),('tok_test_9401_f099d11ed9C1d224c97c3c5EC1B1011D','4242424242424242','789','12','29','Admin Prueba 3','2021-01-30T15:38:54.573+00:00','VISA','VISA-4242','4242',424242,'2021-07-29T15:38:54.000Z',1,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Administrador',NULL,'administrador@gmail.com','3000000000','$2a$10$SFn8J7UQu2jdXbE5/JNtkexY4BzpP6KI8UzXqwV91nRpT1Y78tYiS',1,1,NULL,'2020-08-07 09:00:21','2020-09-11 09:54:02',NULL,NULL),(2,'Admin Prueba 1',NULL,'adminprueba1@gmail.com','3152090200','$2a$10$M515Vll2e7wAv1G8K1hraeyOQRGC38aFCU4HSAq4AzFhrtdkvZn8a',1,3,1,'2021-01-30 15:20:10','2021-01-30 15:20:10',NULL,NULL),(3,'Admin Prueba 2',NULL,'adminprueba2@gmail.com','3152090201','$2a$10$V3leb3yDH288YaD/oMuVz.Rnkl8jBSkbrznrfqTMoCTP8d/.POAb6',1,3,2,'2021-01-30 15:23:12','2021-01-30 15:23:12',NULL,NULL),(4,'Admin Prueba 3',NULL,'adminprueba3@gmail.com','3152090202','$2a$10$65JPsu1mwyHjZf2UUB4mi.Hsnuki.lmPJYDcsATS8Kz.jzFwrZC6.',1,3,3,'2021-01-30 15:23:51','2021-01-30 15:23:51',NULL,NULL),(5,'Usuario 1',111111111,'usuariof1@gmail.com','3192522100','$2a$10$b93f6NpLvaidD61V8qp8xe6igj9w25Y.iu7cw9WQOJ1hk2rxtzM1u',1,2,NULL,'2021-01-30 16:07:36','2021-01-30 16:07:36',NULL,NULL),(6,'Usuario final 2',11111112,'usuariof2@gmail.com','3152522101','$2a$10$yaT0LZgeoTxtqnclLDzOLOoq.5GYpXLKPisqfgx2QlF21kiTN2Ydi',1,2,NULL,'2021-01-30 16:08:47','2021-01-30 16:08:47',NULL,NULL),(7,'Usuario final 3',11111113,'usuariof3@gmail.com','3152522102','$2a$10$8zVTE0SUUj5Te6D9MEbVdOhoBLPQgN0CzuZj7ipeBlhr3Ejo9O5Gi',1,2,NULL,'2021-01-30 16:09:48','2021-01-30 16:09:48',NULL,NULL);
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

-- Dump completed on 2021-01-30 15:42:13
