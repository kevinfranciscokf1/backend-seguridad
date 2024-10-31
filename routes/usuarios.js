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

// Ruta de obtención de todos los usuarios
router.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

// Ruta de obtención de un usuario por su ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta de creación de un nuevo usuario
router.post('/', (req, res) => {
    const nuevoUsuario = req.body;
    db.query('INSERT INTO usuarios SET ?', [nuevoUsuario], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json({ mensaje: 'Usuario creado con éxito' });
        }
    });
});

// Ruta de actualización de un usuario existente
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const datosUsuario = req.body;
    db.query('UPDATE usuarios SET ? WHERE id = ?', [datosUsuario, userId], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json({ mensaje: 'Usuario actualizado con éxito' });
        }
    });
});

// Ruta de eliminación de un usuario
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM usuarios WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json({ mensaje: 'Usuario eliminado con éxito' });
        }
    });
});

// Ruta para autenticar a un usuario
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Datos de inicio de sesión recibidos:', email, password);

    // Buscar al usuario en la base de datos por su correo electrónico
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        // Verificar si se encontró el usuario
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const user = results[0];
        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error('Error en la comparación de contraseñas:', bcryptErr);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (!bcryptResult) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar un token JWT si las credenciales son válidas
            const token = jwt.sign({ userId: user.id }, 'secreto', { expiresIn: '1h' });
            res.json({ token });
        });
    });
});


module.exports = router;
