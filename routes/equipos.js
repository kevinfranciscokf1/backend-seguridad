const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Guatemala23',
    database: 'amt'
});

// Operación READ (Leer)
router.get('/equipos', (req, res) => {
    db.query('SELECT * FROM equipos', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

// Operación CREATE (Crear)
router.post('/equipos', (req, res) => {
    const { codigo, descripcion, serie ,ubicacion } = req.body; 
    const sql = 'INSERT INTO equipos (codigo, descripcion, serie, ubicacion) VALUES (?, ?, ?, ?)';
    db.query(sql, [codigo, descripcion, serie ,ubicacion], (err, result) => {
        if (err) {
            console.error('Error al crear el equipo:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.status(201).json({ message: 'Equipo creado con éxito', equipoId: result.insertId });
        }
    });
});

// Operación UPDATE (Actualizar)
router.put('/equipos/:equipoId', (req, res) => {
    const equipoId = req.params.equipoId;
    const { nombre, descripcion } = req.body; // Datos actualizados.
    const sql = 'UPDATE equipos SET nombre = ?, descripcion = ? WHERE id = ?';
    db.query(sql, [nombre, descripcion, equipoId], (err, result) => {
        if (err) {
            console.error('Error al actualizar el equipo:', err);
            res.status(500).send('Error en el servidor');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Equipo no encontrado' });
            } else {
                res.status(200).json({ message: 'Equipo actualizado con éxito' });
            }
        }
    });
});

// Operación DELETE (Eliminar)
router.delete('/equipos/:equipoId', (req, res) => {
    const equipoId = req.params.equipoId;
    const sql = 'DELETE FROM equipos WHERE id = ?';
    db.query(sql, [equipoId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el equipo:', err);
            res.status(500).send('Error en el servidor');
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Equipo no encontrado' });
            } else {
                res.status(204).send(); // Sin contenido
            }
        }
    });
});

module.exports = router;
