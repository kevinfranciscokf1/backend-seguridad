const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const XLSX = require("xlsx");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Guatemala23',
    database: 'amt'
});

router.get('/mediciones', (req, res) => {
    const sqlQuery = `
    SELECT CODIGO, 
           CONCAT('[', GROUP_CONCAT(JSON_OBJECT('MEDIDA_CM', MEDIDA_CM, 'FECHA_HORA', FECHA_HORA) ORDER BY FECHA_HORA DESC SEPARATOR ','), ']') AS mediciones
    FROM SENSOR_TANQUE_1
    GROUP BY CODIGO;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            // Formatear el resultado JSON en JavaScript
            const formattedResults = results.map(row => ({
                CODIGO: row.CODIGO,
                mediciones: JSON.parse(row.mediciones).slice(0, 10) // Mostrar solo las últimas 10 mediciones
            }));
            res.json(formattedResults);
        }
    });
});

router.get('/historico/:codigo/', (req, res) => {
    const sqlQuery = `
    SELECT CODIGO, 
           CONCAT('[', GROUP_CONCAT(JSON_OBJECT('MEDIDA_CM', MEDIDA_CM, 'FECHA_HORA', FECHA_HORA) ORDER BY FECHA_HORA DESC SEPARATOR ','), ']') AS mediciones
    FROM SENSOR_TANQUE_1
    WHERE CODIGO = ?
    GROUP BY CODIGO;
    `;
    const { codigo, fechai, fechaf } = req.params;

    db.query(sqlQuery, [codigo], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            // Formatear el resultado JSON en JavaScript
            const formattedResults = results.map(row => ({
                CODIGO: row.CODIGO,
                mediciones: JSON.parse(row.mediciones)
            }));

            const dataArray = formattedResults[0].mediciones.map(obj => [obj.MEDIDA_CM, obj.FECHA_HORA]);

            console.log(dataArray)
            // Crea un libro de trabajo (workbook) con una hoja de cálculo
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([['MEDIDA_CM', 'FECHA_HORA'], ...dataArray]);

            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
            //send base 64
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
            res.json(wbout);
        }
    });



});
module.exports = router;
