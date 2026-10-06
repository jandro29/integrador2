const express = require("express");
const router = express.Router();

const pool = require("../config/database");

router.get("/", async (req, res) => {
    try {
        // Cantidad de procesos
        const [procesos] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM convocatoria
        `);

        // Monto referencial y adjudicado
        const [montos] = await pool.query(`
            SELECT
                COALESCE(SUM(monto_referencial), 0) AS montoReferencial,
                COALESCE(SUM(monto_adjudicado), 0) AS montoAdjudicado
            FROM item_adjudicado
        `);

        // Monto contratado
        const [contratos] = await pool.query(`
            SELECT
                COALESCE(SUM(monto_contratado), 0) AS montoContratado
            FROM contrato
        `);

        res.json({
            procesos: procesos[0].total,
            montoReferencial: Number(montos[0].montoReferencial),
            montoAdjudicado: Number(montos[0].montoAdjudicado),
            montoContratado: Number(contratos[0].montoContratado)
        });

    } catch (error) {

        console.error("Error al obtener estadísticas:", error);

        res.status(500).json({
            mensaje: "Error al obtener las estadísticas",
            error: error.message
        });
    }
});

module.exports = router;