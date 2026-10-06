const express = require("express");
const router = express.Router();

const pool = require("../config/database");

// =====================================================
// LISTAR TODOS LOS PROCESOS
// =====================================================

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM vw_obras_publicas_lima
            ORDER BY 1 DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error("Error al obtener procesos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los procesos",
            error: error.message
        });
    }
});

// =====================================================
// COLUMNAS DE LA VISTA (se leen una sola vez)
// Sirven para validar la columna que envía el front
// y evitar inyección SQL.
// =====================================================

let columnasVista = null;

const obtenerColumnas = async () => {
    if (!columnasVista) {
        const [cols] = await pool.query("SHOW COLUMNS FROM vw_obras_publicas_lima");
        columnasVista = cols.map((c) => c.Field);
    }
    return columnasVista;
};

// =====================================================
// DETALLE DE UN PROCESO
//   /api/procesos/detalle?campo=COLUMNA&codigo=VALOR
// =====================================================

router.get("/detalle", async (req, res) => {
    try {
        const campo = String(req.query.campo || "").trim();
        const codigo = String(req.query.codigo || "").trim();

        if (!campo || !codigo) {
            return res.status(400).json({
                mensaje: "Faltan los parámetros campo y codigo"
            });
        }

        const columnas = await obtenerColumnas();

        if (!columnas.includes(campo)) {
            return res.status(400).json({
                mensaje: "La columna indicada no existe en la vista",
                campo,
                columnasDisponibles: columnas
            });
        }

        const [rows] = await pool.query(
            `SELECT *
             FROM vw_obras_publicas_lima
             WHERE \`${campo}\` = ?
             LIMIT 1`,
            [codigo]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontró el proceso",
                campo,
                codigo
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("Error al obtener detalle:", error);

        res.status(500).json({
            mensaje: "Error al obtener el detalle del proceso",
            error: error.message
        });
    }
});

module.exports = router;