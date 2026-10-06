const express = require("express");
const router = express.Router();

const pool = require("../config/database");

// =====================================================
// OBTENER DETALLE COMPLETO DE UN PROCESO
// =====================================================

router.get("/:codigo", async (req, res) => {


try {

    const codigo = decodeURIComponent(
        req.params.codigo
    ).trim();


    if (!codigo) {

        return res.status(400).json({
            mensaje: "No se recibió el código del proceso"
        });

    }


    console.log(
        "Buscando detalle del proceso:",
        codigo
    );


    const [rows] = await pool.query(`
        SELECT *
        FROM vw_obras_publicas_lima
        WHERE codigo_proceso = ?
           OR codigo = ?
           OR nro_proceso = ?
           OR numero_proceso = ?
        LIMIT 1
    `, [
        codigo,
        codigo,
        codigo,
        codigo
    ]);


    if (rows.length === 0) {

        return res.status(404).json({
            mensaje: "No se encontró el proceso",
            codigo: codigo
        });

    }


    console.log(
        "Proceso encontrado:",
        rows[0]
    );


    res.json(rows[0]);


} catch (error) {

    console.error(
        "Error al obtener detalle:",
        error
    );


    res.status(500).json({
        mensaje: "Error al obtener el detalle del proceso",
        error: error.message
    });

}


});

module.exports = router;
