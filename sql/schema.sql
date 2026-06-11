-- Veterinaria Adler — esquema MySQL
CREATE DATABASE IF NOT EXISTS vet_adler
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vet_adler;

DROP TABLE IF EXISTS pedido_items;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS mascotas;
DROP TABLE IF EXISTS ganado;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(120) NOT NULL,
  correo    VARCHAR(160) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  telefono  VARCHAR(30),
  rol       ENUM('admin','user','ganadero') NOT NULL DEFAULT 'user',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE mascotas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80) NOT NULL,
  especie     VARCHAR(40) NOT NULL,
  raza        VARCHAR(80),
  edad        INT,
  dueno_id    INT NOT NULL,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mascotas_dueno FOREIGN KEY (dueno_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE citas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  mascota_id INT NOT NULL,
  fecha      DATE NOT NULL,
  hora       TIME NOT NULL,
  motivo     VARCHAR(200) NOT NULL,
  estado     ENUM('pendiente','confirmada','realizada','cancelada') DEFAULT 'pendiente',
  creado_en  DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_citas_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_citas_mascota FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE productos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  categoria   VARCHAR(80),
  stock       INT NOT NULL DEFAULT 0,
  unidad      VARCHAR(20) DEFAULT 'pza',
  precio      DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_min   INT NOT NULL DEFAULT 1,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id   INT NOT NULL,
  total        DECIMAL(10,2) NOT NULL DEFAULT 0,
  ticket_enviado TINYINT(1) DEFAULT 0,
  estado       ENUM('pendiente','pagado','cancelado') DEFAULT 'pendiente',
  creado_en    DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pedido_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad    INT NOT NULL,
  precio      DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_items_pedido   FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
  CONSTRAINT fk_items_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE ganado (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  arete       VARCHAR(40) NOT NULL UNIQUE,
  tipo        VARCHAR(40) NOT NULL,
  especie     VARCHAR(40) NOT NULL,
  corral      VARCHAR(40),
  sexo        ENUM('M','H') NOT NULL,
  peso        DECIMAL(7,2),
  ganadero_id INT NOT NULL,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ganado_ganadero FOREIGN KEY (ganadero_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
