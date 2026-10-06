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

        // Evolución del monto contratado por año
        // (en su propio try/catch para no romper el resto si falla)
        let evolucion = [];
        try {
            const [filas] = await pool.query(`
                SELECT
                    YEAR(fecha_contrato) AS anio,
                    COALESCE(SUM(monto_contratado), 0) AS monto
                FROM contrato
                WHERE fecha_contrato IS NOT NULL
                GROUP BY YEAR(fecha_contrato)
                ORDER BY anio
            `);

            evolucion = filas.map((fila) => ({
                anio: String(fila.anio),
                monto: Number(fila.monto),
            }));
        } catch (errorEvolucion) {
            console.error(
                "Error al obtener la evolución (revisa el nombre de la columna de fecha):",
                errorEvolucion.message
            );
        }

        res.json({
            procesos: procesos[0].total,
            montoReferencial: Number(montos[0].montoReferencial),
            montoAdjudicado: Number(montos[0].montoAdjudicado),
            montoContratado: Number(contratos[0].montoContratado),
            evolucion,
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