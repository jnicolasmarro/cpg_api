-- MySQL Script generated by MySQL Workbench
-- Thu Jul 16 08:00:37 2020
-- Model: New Model    Version: 1.0
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
-- Table `cpg`.`experiencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`experiencia` (
  `id_experiencia` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(1000) NOT NULL,
  `estado_experiencia` TINYINT NOT NULL DEFAULT 1,
  `comision` INT NOT NULL,
  `imagen_experiencia` VARCHAR(1000) NOT NULL,
  `precio` INT NOT NULL,
  `establecimiento_nit` BIGINT(15) NOT NULL,
  PRIMARY KEY (`id_experiencia`),
  UNIQUE INDEX `id_experiencia_UNIQUE` (`id_experiencia` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`aplicacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`aplicacion` (
  `id_aplicacion` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_terminacion` DATE NOT NULL,
  `fecha_aplicacion` DATETIME NOT NULL,
  `experiencia_id_experiencia` INT NOT NULL,
  PRIMARY KEY (`id_aplicacion`),
  INDEX `fk_aplicacion_experiencia1_idx` (`experiencia_id_experiencia` ASC) VISIBLE,
  CONSTRAINT `fk_aplicacion_experiencia1`
    FOREIGN KEY (`experiencia_id_experiencia`)
    REFERENCES `cpg`.`experiencia` (`id_experiencia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`rol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`rol` (
  `id_rol` INT NOT NULL,
  `nombre_rol` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE INDEX `id_rol_UNIQUE` (`id_rol` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`user` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(300) NOT NULL,
  `email` VARCHAR(300) NOT NULL,
  `numero_celular` VARCHAR(15) NOT NULL,
  `password` VARCHAR(1000) NOT NULL,
  `estado_user` TINYINT NOT NULL DEFAULT 1,
  `rol_id_rol` INT NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE INDEX `identificacion_UNIQUE` (`id_user` ASC) VISIBLE,
  INDEX `fk_user_rol1_idx` (`rol_id_rol` ASC) VISIBLE,
  CONSTRAINT `fk_user_rol1`
    FOREIGN KEY (`rol_id_rol`)
    REFERENCES `cpg`.`rol` (`id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`membresia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`membresia` (
  `id_membresia` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `user_id_user` INT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`id_membresia`),
  INDEX `fk_membresia_user1_idx` (`user_id_user` ASC) VISIBLE,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) VISIBLE,
  UNIQUE INDEX `user_id_user_UNIQUE` (`user_id_user` ASC) VISIBLE,
  CONSTRAINT `fk_membresia_user1`
    FOREIGN KEY (`user_id_user`)
    REFERENCES `cpg`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`experiencia_usada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`experiencia_usada` (
  `id_uso` INT NOT NULL AUTO_INCREMENT,
  `fecha_uso` DATETIME NOT NULL,
  PRIMARY KEY (`id_uso`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`opcion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`opcion` (
  `id_opcion` INT NOT NULL,
  `titulo_opcion` VARCHAR(45) NOT NULL,
  `descripcion_opcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_opcion`),
  UNIQUE INDEX `id_descripcion_UNIQUE` (`id_opcion` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`establecimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`establecimiento` (
  `nit` BIGINT(20) NOT NULL,
  `nombre_empresa` VARCHAR(100) NOT NULL,
  `establecimiento_comercial` VARCHAR(100) NOT NULL,
  `correo_establecimiento` VARCHAR(45) NOT NULL,
  `celular_establecimiento` VARCHAR(45) NOT NULL,
  `direccion_establecimiento` VARCHAR(150) NOT NULL,
  `autorizacion_datos` TINYINT NOT NULL,
  `autorizacion_debito` TINYINT NOT NULL,
  `logo_establecimiento` VARCHAR(300) NULL,
  `estado_establecimiento` TINYINT NOT NULL DEFAULT 1,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`nit`),
  UNIQUE INDEX `nit_UNIQUE` (`nit` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`tarjeta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`tarjeta` (
  `number` BIGINT(16) NOT NULL,
  `exp_month` INT NOT NULL,
  `exp_year` INT NOT NULL,
  `cvc` VARCHAR(300) NOT NULL,
  `establecimiento_nit` BIGINT(20) NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  INDEX `fk_tarjeta_establecimiento1_idx` (`establecimiento_nit` ASC) VISIBLE,
  UNIQUE INDEX `establecimiento_nit_UNIQUE` (`establecimiento_nit` ASC) VISIBLE,
  CONSTRAINT `fk_tarjeta_establecimiento1`
    FOREIGN KEY (`establecimiento_nit`)
    REFERENCES `cpg`.`establecimiento` (`nit`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`user_has_establecimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`user_has_establecimiento` (
  `user_id_user` INT NOT NULL,
  `establecimiento_nit` BIGINT(20) NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`user_id_user`, `establecimiento_nit`),
  INDEX `fk_user_has_establecimiento_establecimiento1_idx` (`establecimiento_nit` ASC) VISIBLE,
  INDEX `fk_user_has_establecimiento_user1_idx` (`user_id_user` ASC) VISIBLE,
  UNIQUE INDEX `user_id_user_UNIQUE` (`user_id_user` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_establecimiento_user1`
    FOREIGN KEY (`user_id_user`)
    REFERENCES `cpg`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_establecimiento_establecimiento1`
    FOREIGN KEY (`establecimiento_nit`)
    REFERENCES `cpg`.`establecimiento` (`nit`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cpg`.`customer_sq`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cpg`.`customer_sq` (
  `customer_id` VARCHAR(255) NOT NULL,
  `establecimiento_nit` BIGINT(20) NOT NULL,
  INDEX `fk_customer_sq_establecimiento1_idx` (`establecimiento_nit` ASC) VISIBLE,
  PRIMARY KEY (`customer_id`),
  UNIQUE INDEX `establecimiento_nit_UNIQUE` (`establecimiento_nit` ASC) VISIBLE,
  UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC) VISIBLE,
  CONSTRAINT `fk_customer_sq_establecimiento1`
    FOREIGN KEY (`establecimiento_nit`)
    REFERENCES `cpg`.`establecimiento` (`nit`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
