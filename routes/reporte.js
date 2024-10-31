const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Guatemala23',
    database: 'amt'
});

router.get('/reporte', (req, res) => {
    db.query('SELECT * FROM sensor_tanque_1', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;