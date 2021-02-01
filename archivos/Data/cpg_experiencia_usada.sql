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
-- Table structure for table `experiencia_usada`
--

DROP TABLE IF EXISTS `experiencia_usada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencia_usada` (
  `id_experiencia_usada` bigint NOT NULL AUTO_INCREMENT,
  `experiencia_usada_id_user` int NOT NULL,
  `experiencia_usada_id_experiencia` int NOT NULL,
  `valor_comision` bigint NOT NULL,
  `fecha_uso_experiencia_usada` datetime NOT NULL,
  `renovado_experiencia_usada` tinyint NOT NULL DEFAULT '0',
  `cobrada_experiencia_usada` tinyint NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_experiencia_usada`,`experiencia_usada_id_user`,`experiencia_usada_id_experiencia`),
  KEY `fk_experiencia_usada_experiencia1_idx` (`experiencia_usada_id_experiencia`),
  KEY `fk_experiencia_usada_user1_idx` (`experiencia_usada_id_user`),
  CONSTRAINT `fk_experiencia_usada_experiencia` FOREIGN KEY (`experiencia_usada_id_experiencia`) REFERENCES `experiencia` (`id_experiencia`),
  CONSTRAINT `fk_experiencia_usada_user` FOREIGN KEY (`experiencia_usada_id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencia_usada`
--

LOCK TABLES `experiencia_usada` WRITE;
/*!40000 ALTER TABLE `experiencia_usada` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencia_usada` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-30 10:17:24
