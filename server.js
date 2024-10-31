const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
const usuariosRouter = require('./routes/usuarios');
const informeRouter = require('./routes/reporte');
const equiposRouter = require('./routes/equipos');
const tanquesRouter = require('./routes/tanques');
const ubicacionesRouter = require('./routes/ubicaciones');
const medicionesRouter = require('./routes/mediciones');

app.use(cors({
    origin: 'http://localhost:4200', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
    optionsSuccessStatus: 204
}));

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Guatemala23',
    database: 'amt'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos');

        // Inicia el servidor solo después de la conexión exitosa
        const port = 3000;
        app.listen(port, () => {
            console.log(`Servidor iniciado en el puerto ${port}`);
        });
    }
});

app.use('/usuarios', usuariosRouter);
app.use('/reporte', informeRouter);
app.use('/equipos', equiposRouter);
app.use('/tanques', tanquesRouter);
app.use('/ubicaciones', ubicacionesRouter);
app.use('/mediciones', medicionesRouter);