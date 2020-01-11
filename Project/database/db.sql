CREATE DATABASE database_programa_social;

USE database_programa_social;

-- USERS TABLE --
CREATE TABLE usuarios (
    id_usuario INT(11) NOT NULL AUTO_INCREMENT,
    correo VARCHAR(20) NOT NULL,
    password VARCHAR(60) NOT NULL,
    nombres VARCHAR(25) NOT NULL,
    paterno VARCHAR(30) NOT NULL,
    materno VARCHAR(30),
    CONSTRAINT usuarios_pk PRIMARY KEY (id_usuario)
);

DESCRIBE usuarios;

-- PROFILES TABLE --
CREATE TABLE perfiles (
    id_perfil INT(11) NOT NULL AUTO_INCREMENT,
    perfil VARCHAR(30) NOT NULL,
    permisos ENUM('Administrador', 'Apoyo') NOT NULL,
    id_usuario INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT perfiles_pk PRIMARY KEY (id_perfil),
    CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

DESCRIBE perfiles;

