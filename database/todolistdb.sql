-- ============================
-- CREACIÓN DE BASE DE DATOS
-- ============================

CREATE DATABASE todolistdb;

\c todolistdb;

-- ============================
-- TABLA USUARIO
-- ============================

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

-- ============================
-- TABLA CATEGORIA
-- ============================

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color_hex CHAR(7) NOT NULL
);

-- ============================
-- TABLA TAREA
-- ============================

CREATE TABLE tarea (
    id_tarea SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    story_points INTEGER CHECK (story_points >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_entrega DATE,

    id_usuario_creador INTEGER NOT NULL,
    id_usuario_asignado INTEGER NOT NULL,

    CONSTRAINT fk_creador
        FOREIGN KEY (id_usuario_creador)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_asignado
        FOREIGN KEY (id_usuario_asignado)
        REFERENCES usuario(id_usuario),

    CONSTRAINT tarea_estado_check
        CHECK (estado IN ('PENDIENTE', 'EN_PROGRESO', 'EN_REVISION', 'COMPLETADO'))
);

-- ============================
-- TABLA COMENTARIO
-- ============================

CREATE TABLE comentario (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    id_usuario INTEGER NOT NULL,
    id_tarea INTEGER NOT NULL,

    CONSTRAINT fk_usuario_comentario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_tarea_comentario
        FOREIGN KEY (id_tarea)
        REFERENCES tarea(id_tarea)
        ON DELETE CASCADE
);

-- ============================
-- TABLA INTERMEDIA TAREA_CATEGORIA (N:M)
-- ============================

CREATE TABLE tarea_categoria (
    id_tarea INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,

    PRIMARY KEY (id_tarea, id_categoria),

    CONSTRAINT fk_tc_tarea
        FOREIGN KEY (id_tarea)
        REFERENCES tarea(id_tarea)
        ON DELETE CASCADE,

    CONSTRAINT fk_tc_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
        ON DELETE CASCADE
);