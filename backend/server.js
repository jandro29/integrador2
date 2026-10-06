require('dotenv').config();

const express = require('express');
const cors = require('cors');

const procesosRoutes = require('./src/routes/procesos');
const estadisticasRoutes = require('./src/routes/estadisticas');
const pool = require('./src/config/database');


const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend funcionando correctamente'
    });
});

app.get('/api/prueba-db', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM stg_obras_publicas
        `);

        res.json({
            conexion: 'OK',
            filas: rows[0].total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            conexion: 'ERROR',
            mensaje: error.message
        });
    }
});

// Estadísticas
app.use('/api/estadisticas', estadisticasRoutes);

// Procesos
app.use('/api/procesos', procesosRoutes);

// Procesos Detalles
app.use("/api/procesos", procesosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});