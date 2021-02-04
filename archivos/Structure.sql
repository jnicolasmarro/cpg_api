-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema cpg
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cpg
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cpg` DEFAULT CHARACTER SET utf8 ;
USE `cpg` ;

-- -----------------------------------------------------
-- Table `cpg`.`experiencia_tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`experiencia_tipo` (
  `id_tipo` INT NOT NULL AUTO_INCREMENT,
  `tipo_experiencia` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo`))
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`ciudad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`ciudad` (
  `id_ciudad` INT NOT NULL AUTO_INCREMENT,
  `nombre_ciudad` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  UNIQUE INDEX `nombre_ciudad_UNIQUE` (`nombre_ciudad` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`establecimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`establecimiento` (
  `id_establecimiento` INT NOT NULL AUTO_INCREMENT,
  `nit_establecimiento` BIGINT(20) NOT NULL,
  `nombre_establecimiento` VARCHAR(50) NOT NULL,
  `establecimiento_comercial` VARCHAR(60) NOT NULL,
  `correo_establecimiento` VARCHAR(60) NOT NULL,
  `celular_establecimiento` VARCHAR(10) NOT NULL,
  `direccion_establecimiento` VARCHAR(100) NOT NULL,
  `autorizacion_datos` TINYINT NOT NULL,
  `autorizacion_debito` TINYINT NOT NULL,
  `logo_establecimiento` VARCHAR(150) NULL,
  `estado_establecimiento` TINYINT NOT NULL DEFAULT 1,
  `establecimiento_id_ciudad` INT NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id_establecimiento`),
  INDEX `fk_establecimiento_ciudad_idx` (`establecimiento_id_ciudad` ASC) VISIBLE,
  UNIQUE INDEX `nombre_empresa_UNIQUE` (`nombre_establecimiento` ASC) VISIBLE,
  UNIQUE INDEX `logo_establecimiento_UNIQUE` (`logo_establecimiento` ASC) VISIBLE,
  UNIQUE INDEX `correo_establecimiento_UNIQUE` (`correo_establecimiento` ASC) VISIBLE,
  UNIQUE INDEX `nit_UNIQUE` (`nit_establecimiento` ASC) VISIBLE,
  UNIQUE INDEX `id_establecimiento_UNIQUE` (`id_establecimiento` ASC) VISIBLE,
  CONSTRAINT `fk_establecimiento_ciudad`
    FOREIGN KEY (`establecimiento_id_ciudad`)
    REFERENCES `cpg`.`ciudad` (`id_ciudad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`experiencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`experiencia` (
  `id_experiencia` INT NOT NULL AUTO_INCREMENT,
  `titulo_experiencia` VARCHAR(150) NOT NULL,
  `descripcion_experiencia` VARCHAR(200) NOT NULL,
  `precio_experiencia` BIGINT(7) NOT NULL,
  `precio_publico` BIGINT(7) NOT NULL,
  `estado_experiencia` TINYINT NOT NULL DEFAULT 0,
  `comision` DECIMAL(5,2) NOT NULL,
  `imagen_experiencia` VARCHAR(150) NULL,
  `experiencia_tipo_id_tipo` INT NOT NULL,
  `id_establecimiento_experiencia` INT NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id_experiencia`),
  INDEX `fk_experiencia_experiencia_tipo_idx` (`experiencia_tipo_id_tipo` ASC) VISIBLE,
  INDEX `fk_experiencia_establecimiento_idx` (`id_establecimiento_experiencia` ASC) VISIBLE,
  UNIQUE INDEX `imagen_experiencia_UNIQUE` (`imagen_experiencia` ASC) VISIBLE,
  CONSTRAINT `fk_experiencia_experiencia_tipo`
    FOREIGN KEY (`experiencia_tipo_id_tipo`)
    REFERENCES `cpg`.`experiencia_tipo` (`id_tipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_experiencia_establecimiento`
    FOREIGN KEY (`id_establecimiento_experiencia`)
    REFERENCES `cpg`.`establecimiento` (`id_establecimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`rol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`rol` (
  `id_rol` INT NOT NULL,
  `nombre_rol` VARCHAR(45) NOT NULL,
  `interfaz_movil` TINYINT NOT NULL,
  `interfaz_web` TINYINT NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE INDEX `id_rol_UNIQUE` (`id_rol` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`user` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(100) NOT NULL,
  `numero_identificacion` BIGINT(15) NULL,
  `email` VARCHAR(50) NOT NULL,
  `numero_celular` VARCHAR(10) NULL,
  `password` VARCHAR(1000) NOT NULL,
  `estado_user` TINYINT NOT NULL DEFAULT 1,
  `rol_id_rol` INT NOT NULL DEFAULT 2,
  `id_establecimiento_user` INT NULL,
  `user_direccion` VARCHAR(400) NULL,
  `user_id_ciudad` INT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id_user`),
  INDEX `fk_user_rol_idx` (`rol_id_rol` ASC) VISIBLE,
  INDEX `fk_user_establecimiento_idx` (`id_establecimiento_user` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_user_ciudad_idx` (`user_id_ciudad` ASC) VISIBLE,
  CONSTRAINT `fk_user_rol`
    FOREIGN KEY (`rol_id_rol`)
    REFERENCES `cpg`.`rol` (`id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_establecimiento`
    FOREIGN KEY (`id_establecimiento_user`)
    REFERENCES `cpg`.`establecimiento` (`id_establecimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_ciudad`
    FOREIGN KEY (`user_id_ciudad`)
    REFERENCES `cpg`.`ciudad` (`id_ciudad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`afiliacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`afiliacion` (
  `codigo_afiliacion` VARCHAR(8) NOT NULL,
  `afiliacion_asignada` TINYINT NOT NULL DEFAULT 0,
  `afiliacion_id_user` INT NULL,
  `fecha_activacion` DATETIME NULL,
  `fecha_vencimiento` DATETIME NULL,
  `fecha_expiracion` DATETIME NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`codigo_afiliacion`),
  INDEX `fk_afiliacion_user_idx` (`afiliacion_id_user` ASC) VISIBLE,
  CONSTRAINT `fk_afiliacion_user`
    FOREIGN KEY (`afiliacion_id_user`)
    REFERENCES `cpg`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`factura` (
  `id_factura` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `total_monto` DECIMAL(10,2) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id_factura`))
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`experiencia_usada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`experiencia_usada` (
  `id_experiencia_usada` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `experiencia_usada_id_user` INT NOT NULL,
  `experiencia_usada_id_experiencia` INT NOT NULL,
  `valor_comision` DECIMAL(10,2) NOT NULL,
  `fecha_uso_experiencia_usada` DATETIME NOT NULL,
  `renovado_experiencia_usada` TINYINT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  `experiencia_usada_id_factura` BIGINT(10) NULL,
  INDEX `fk_experiencia_usada_experiencia_idx` (`experiencia_usada_id_experiencia` ASC) VISIBLE,
  INDEX `fk_experiencia_usada_user_idx` (`experiencia_usada_id_user` ASC) VISIBLE,
  PRIMARY KEY (`id_experiencia_usada`, `experiencia_usada_id_user`, `experiencia_usada_id_experiencia`),
  INDEX `fk_experiencia_usada_factura_idx` (`experiencia_usada_id_factura` ASC) VISIBLE,
  CONSTRAINT `fk_experiencia_usada_experiencia`
    FOREIGN KEY (`experiencia_usada_id_experiencia`)
    REFERENCES `cpg`.`experiencia` (`id_experiencia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_experiencia_usada_user`
    FOREIGN KEY (`experiencia_usada_id_user`)
    REFERENCES `cpg`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_experiencia_usada_factura`
    FOREIGN KEY (`experiencia_usada_id_factura`)
    REFERENCES `cpg`.`factura` (`id_factura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`item` (
  `id_item` INT NOT NULL AUTO_INCREMENT,
  `titulo_item` VARCHAR(100) NOT NULL,
  `descripcion_item` VARCHAR(800) NOT NULL,
  `estado_item` TINYINT NOT NULL DEFAULT 1,
  `experiencia_id_experiencia_item` INT NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id_item`),
  INDEX `fk_item_experiencia_idx` (`experiencia_id_experiencia_item` ASC) VISIBLE,
  CONSTRAINT `fk_item_experiencia`
    FOREIGN KEY (`experiencia_id_experiencia_item`)
    REFERENCES `cpg`.`experiencia` (`id_experiencia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`util`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`util` (
  `id_param` INT NOT NULL,
  `nombre_param` VARCHAR(45) NOT NULL,
  `valor_param` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id_param`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`periodo_afiliacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`periodo_afiliacion` (
  `afiliacion_codigo_afiliacion` VARCHAR(8) NOT NULL,
  `periodo_afiliacion` INT NOT NULL,
  `fecha_afiliacion` DATETIME NOT NULL,
  PRIMARY KEY (`afiliacion_codigo_afiliacion`, `periodo_afiliacion`),
  INDEX `fk_periodo_afiliacion_afiliacion_idx` (`afiliacion_codigo_afiliacion` ASC) VISIBLE,
  CONSTRAINT `fk_periodo_afiliacion_afiliacion`
    FOREIGN KEY (`afiliacion_codigo_afiliacion`)
    REFERENCES `cpg`.`afiliacion` (`codigo_afiliacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`noticia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`noticia` (
  `id_noticia` INT NOT NULL AUTO_INCREMENT,
  `titulo_noticia` VARCHAR(100) NOT NULL,
  `contenido_noticia` VARCHAR(1000) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP NULL,
  `imagen_noticia` VARCHAR(100) NULL,
  `estado_noticia` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_noticia`))
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`tarjeta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`tarjeta` (
  `id_tarjeta` VARCHAR(200) NOT NULL,
  `numero_tarjeta` VARCHAR(16) NOT NULL,
  `cvc` VARCHAR(3) NOT NULL,
  `exp_month` VARCHAR(2) NOT NULL,
  `exp_year` VARCHAR(2) NOT NULL,
  `card_holder` VARCHAR(100) NOT NULL,
  `created_at` VARCHAR(200) NOT NULL,
  `brand` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `last_four` VARCHAR(4) NOT NULL,
  `bin` BIGINT(10) NOT NULL,
  `expires_at` VARCHAR(100) NOT NULL,
  `estado_tarjeta` TINYINT NOT NULL DEFAULT 1,
  `id_establecimiento_tarjeta` INT NOT NULL,
  PRIMARY KEY (`id_tarjeta`),
  INDEX `fk_tarjeta_establecimiento_idx` (`id_establecimiento_tarjeta` ASC) VISIBLE,
  CONSTRAINT `fk_tarjeta_establecimiento`
    FOREIGN KEY (`id_establecimiento_tarjeta`)
    REFERENCES `cpg`.`establecimiento` (`id_establecimiento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`tipo_fuente_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`tipo_fuente_pago` (
  `id_tipo_fuente_pago` INT NOT NULL,
  `nombre_tipo_fuente_pago` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_fuente_pago`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`fuente_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`fuente_pago` (
  `id_fuente_pago` BIGINT(10) NOT NULL,
  `acceptance_token` VARCHAR(1000) NULL,
  `customer_email` VARCHAR(500) NULL,
  `id_tarjeta_fuente_pago` VARCHAR(200) NULL,
  `fuente_pago_id_tipo_fuente_pago` INT NOT NULL,
  `cuotas_pago` INT NULL,
  PRIMARY KEY (`id_fuente_pago`),
  INDEX `fk_fuente_pago_tarjeta_idx` (`id_tarjeta_fuente_pago` ASC) VISIBLE,
  INDEX `fk_fuente_pago_tipo_fuente_pago_idx` (`fuente_pago_id_tipo_fuente_pago` ASC) VISIBLE,
  CONSTRAINT `fk_fuente_pago_tarjeta`
    FOREIGN KEY (`id_tarjeta_fuente_pago`)
    REFERENCES `cpg`.`tarjeta` (`id_tarjeta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_fuente_pago_tipo_fuente_pago`
    FOREIGN KEY (`fuente_pago_id_tipo_fuente_pago`)
    REFERENCES `cpg`.`tipo_fuente_pago` (`id_tipo_fuente_pago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`pago` (
  `id_pago` INT NOT NULL AUTO_INCREMENT,
  `pago_fuente_pago` BIGINT(10) NULL,
  `pago_id_factura` BIGINT(10) NOT NULL,
  `id_transaction` VARCHAR(100) NULL,
  `actual` TINYINT NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  INDEX `fk_pago_fuente_pago_idx` (`pago_fuente_pago` ASC) VISIBLE,
  INDEX `fk_pago_factura_idx` (`pago_id_factura` ASC) VISIBLE,
  PRIMARY KEY (`id_pago`),
  CONSTRAINT `fk_pago_fuente_pago`
    FOREIGN KEY (`pago_fuente_pago`)
    REFERENCES `cpg`.`fuente_pago` (`id_fuente_pago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pago_factura`
    FOREIGN KEY (`pago_id_factura`)
    REFERENCES `cpg`.`factura` (`id_factura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Table `cpg`.`estado_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`estado_pago` (
  `id_estado_pago` INT NOT NULL,
  `nombre_estado_pago` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_estado_pago`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`estado_factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`estado_factura` (
  `id_estado_factura` INT NOT NULL,
  `nombre_estado_factura` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_estado_factura`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`pago_estado_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`pago_estado_pago` (
  `pago_id_pago` INT NOT NULL,
  `estado_pago_id_estado_pago` INT NOT NULL,
  `pago_estado_pago_actual` TINYINT NOT NULL,
  `observacion` VARCHAR(200) NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  INDEX `fk_pago_estado_pago_pago_idx` (`pago_id_pago` ASC) VISIBLE,
  INDEX `fk_pago_estado_pago_estado_pago_idx` (`estado_pago_id_estado_pago` ASC) VISIBLE,
  CONSTRAINT `fk_pago_estado_pago_pago`
    FOREIGN KEY (`pago_id_pago`)
    REFERENCES `cpg`.`pago` (`id_pago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pago_estado_pago_estado_pago`
    FOREIGN KEY (`estado_pago_id_estado_pago`)
    REFERENCES `cpg`.`estado_pago` (`id_estado_pago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`factura_estado_factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`factura_estado_factura` (
  `factura_id_factura` BIGINT(10) NOT NULL,
  `estado_factura_id_estado_factura` INT NOT NULL,
  `factura_estado_factura_actual` TINYINT NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  INDEX `fk_factura_factura_estado_factura_idx` (`factura_id_factura` ASC) VISIBLE,
  INDEX `fk_estado_factura_factura_estado_factura_idx` (`estado_factura_id_estado_factura` ASC) INVISIBLE,
  CONSTRAINT `fk_factura_factura_estado_factura`
    FOREIGN KEY (`factura_id_factura`)
    REFERENCES `cpg`.`factura` (`id_factura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estado_factura_factura_estado_factura`
    FOREIGN KEY (`estado_factura_id_estado_factura`)
    REFERENCES `cpg`.`estado_factura` (`id_estado_factura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Data for table `cpg`.`experiencia_tipo`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`experiencia_tipo` (`id_tipo`, `tipo_experiencia`) VALUES (1, 'Cenas especiales');
INSERT INTO `cpg`.`experiencia_tipo` (`id_tipo`, `tipo_experiencia`) VALUES (2, 'Seleccion de productos');
INSERT INTO `cpg`.`experiencia_tipo` (`id_tipo`, `tipo_experiencia`) VALUES (3, 'Bienestar');

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`ciudad`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`ciudad` (`id_ciudad`, `nombre_ciudad`) VALUES (1, 'Bogotá');
INSERT INTO `cpg`.`ciudad` (`id_ciudad`, `nombre_ciudad`) VALUES (2, 'Medellin');
INSERT INTO `cpg`.`ciudad` (`id_ciudad`, `nombre_ciudad`) VALUES (3, 'Cali');
INSERT INTO `cpg`.`ciudad` (`id_ciudad`, `nombre_ciudad`) VALUES (4, 'Barranquilla');

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`rol`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`rol` (`id_rol`, `nombre_rol`, `interfaz_movil`, `interfaz_web`) VALUES (1, 'Super Usuario', 0, 1);
INSERT INTO `cpg`.`rol` (`id_rol`, `nombre_rol`, `interfaz_movil`, `interfaz_web`) VALUES (2, 'Usuario Final', 1, 0);
INSERT INTO `cpg`.`rol` (`id_rol`, `nombre_rol`, `interfaz_movil`, `interfaz_web`) VALUES (3, 'Administrador Establecimiento', 1, 0);
INSERT INTO `cpg`.`rol` (`id_rol`, `nombre_rol`, `interfaz_movil`, `interfaz_web`) VALUES (4, 'Asistente Establecimiento', 1, 0);

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`user`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`user` (`id_user`, `nombre_usuario`, `numero_identificacion`, `email`, `numero_celular`, `password`, `estado_user`, `rol_id_rol`, `id_establecimiento_user`, `user_direccion`, `user_id_ciudad`, `createdAt`, `updatedAt`) VALUES (1, 'Super Usuario', NULL, 'superusuario@gmail.com', NULL, '$2a$10$SHk5r6DQs8v.3wkpPFqnyuo2vXHz1BnUTfrw3USMBj303Zf/E/w9C', 1, 1, NULL, NULL, NULL, NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`util`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`util` (`id_param`, `nombre_param`, `valor_param`) VALUES (1, 'Días de vencimiento de una afiliación', '183');
INSERT INTO `cpg`.`util` (`id_param`, `nombre_param`, `valor_param`) VALUES (2, 'Línea de WhatsApp', '3150000000');
INSERT INTO `cpg`.`util` (`id_param`, `nombre_param`, `valor_param`) VALUES (3, 'Link Chat de WhatsApp', 'https://api.whatsapp.com/send?phone=573192522839&text=Quiero%20soporte%20en%20la%20aplicaci%C3%B3n');
INSERT INTO `cpg`.`util` (`id_param`, `nombre_param`, `valor_param`) VALUES (4, 'Version App Movil', '1000');

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`tipo_fuente_pago`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`tipo_fuente_pago` (`id_tipo_fuente_pago`, `nombre_tipo_fuente_pago`) VALUES (1, 'CARD');
INSERT INTO `cpg`.`tipo_fuente_pago` (`id_tipo_fuente_pago`, `nombre_tipo_fuente_pago`) VALUES (2, 'PAGO MANUAL');

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`fuente_pago`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`fuente_pago` (`id_fuente_pago`, `acceptance_token`, `customer_email`, `id_tarjeta_fuente_pago`, `fuente_pago_id_tipo_fuente_pago`, `cuotas_pago`) VALUES (1, NULL, NULL, NULL, 2, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`estado_pago`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`estado_pago` (`id_estado_pago`, `nombre_estado_pago`) VALUES (1, 'GENERADO');
INSERT INTO `cpg`.`estado_pago` (`id_estado_pago`, `nombre_estado_pago`) VALUES (2, 'PENDING');
INSERT INTO `cpg`.`estado_pago` (`id_estado_pago`, `nombre_estado_pago`) VALUES (3, 'APPROVED');
INSERT INTO `cpg`.`estado_pago` (`id_estado_pago`, `nombre_estado_pago`) VALUES (4, 'VOIDED');
INSERT INTO `cpg`.`estado_pago` (`id_estado_pago`, `nombre_estado_pago`) VALUES (5, 'DECLINED');
INSERT INTO `cpg`.`estado_pago` (`id_estado_pago`, `nombre_estado_pago`) VALUES (6, 'ERROR');

COMMIT;


-- -----------------------------------------------------
-- Data for table `cpg`.`estado_factura`
-- -----------------------------------------------------
START TRANSACTION;
USE `cpg`;
INSERT INTO `cpg`.`estado_factura` (`id_estado_factura`, `nombre_estado_factura`) VALUES (1, 'PAGADA');
INSERT INTO `cpg`.`estado_factura` (`id_estado_factura`, `nombre_estado_factura`) VALUES (2, 'SIN PAGAR');
INSERT INTO `cpg`.`estado_factura` (`id_estado_factura`, `nombre_estado_factura`) VALUES (3, 'ANULADA');
INSERT INTO `cpg`.`estado_factura` (`id_estado_factura`, `nombre_estado_factura`) VALUES (4, 'CREADA');

COMMIT;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
