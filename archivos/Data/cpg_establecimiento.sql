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
  `establecimiento_id_ciudad` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_establecimiento`),
  UNIQUE KEY `nombre_empresa_UNIQUE` (`nombre_establecimiento`),
  UNIQUE KEY `correo_establecimiento_UNIQUE` (`correo_establecimiento`),
  UNIQUE KEY `nit_UNIQUE` (`nit_establecimiento`),
  UNIQUE KEY `id_establecimiento_UNIQUE` (`id_establecimiento`),
  UNIQUE KEY `logo_establecimiento_UNIQUE` (`logo_establecimiento`),
  KEY `fk_establecimiento_ciudad1_idx` (`establecimiento_id_ciudad`),
  CONSTRAINT `fk_establecimiento_ciudad1` FOREIGN KEY (`establecimiento_id_ciudad`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establecimiento`
--

LOCK TABLES `establecimiento` WRITE;
/*!40000 ALTER TABLE `establecimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `establecimiento` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-30 10:17:23
