const express = require("express");
const router = express.Router();

const pool = require("../config/database");

const VISTA = "vw_obras_publicas_lima";

// =====================================================
// COLUMNAS DE LA VISTA
// Se detectan solas por el nombre. Si alguna no se detecta
// bien, escribe aquí el nombre REAL (ver /api/comparar/columnas).
// =====================================================

const MANUAL = {
    entidad: "",      // ej: "entidad"
    fecha: "",        // ej: "fecha_convocatoria"
    montoRef: "",     // ej: "monto_referencial"
    montoAdj: "",     // ej: "monto_adjudicado"
    montoCont: ""     // ej: "monto_contratado"
};

const PATRONES = {
    entidad: [/^entidad$/i, /^nombre_entidad$/i, /^entidad_nombre$/i, /entidad/i],
    fecha: [/^fecha_convocatoria$/i, /^fecha$/i, /^fecha_proceso$/i, /fecha/i],
    montoRef: [/^monto_referencial$/i, /^monto_referencia$/i, /^valor_referencial$/i, /referencial/i],
    montoAdj: [/monto.*adjudic/i, /valor.*adjudic/i, /adjudic.*monto/i],
    montoCont: [/monto.*contrat/i, /valor.*contrat/i, /contrat.*monto/i]
};

let config = null;

const obtenerConfig = async () => {
    if (config) return config;

    const [cols] = await pool.query(`SHOW COLUMNS FROM ${VISTA}`);
    const nombres = cols.map((c) => c.Field);

    const resultado = { todas: nombres };

    for (const clave of Object.keys(PATRONES)) {
        if (MANUAL[clave] && nombres.includes(MANUAL[clave])) {
            resultado[clave] = MANUAL[clave];
            continue;
        }

        resultado[clave] = null;
        for (const patron of PATRONES[clave]) {
            const encontrada = nombres.find((n) => patron.test(n));
            if (encontrada) {
                resultado[clave] = encontrada;
                break;
            }
        }
    }

    config = resultado;
    return config;
};

// Suma de una columna (o NULL si la columna no existe)
const suma = (col) => (col ? `SUM(\`${col}\`)` : "NULL");

const aNumero = (v) => (v === null || v === undefined ? null : Number(v));

// =====================================================
// DIAGNÓSTICO: qué columnas se detectaron
//   GET /api/comparar/columnas
// =====================================================

router.get("/columnas", async (req, res) => {
    try {
        res.json(await obtenerConfig());
    } catch (error) {
        res.status(500).json({ mensaje: "Error al leer columnas", error: error.message });
    }
});

// =====================================================
// LISTA DE ENTIDADES
//   GET /api/comparar/entidades
// =====================================================

router.get("/entidades", async (req, res) => {
    try {
        const c = await obtenerConfig();

        if (!c.entidad) {
            return res.status(500).json({ mensaje: "No se detectó la columna de entidad" });
        }

        const [rows] = await pool.query(`
            SELECT DISTINCT \`${c.entidad}\` AS nombre
            FROM ${VISTA}
            WHERE \`${c.entidad}\` IS NOT NULL AND \`${c.entidad}\` <> ''
            ORDER BY 1
        `);

        res.json(rows.map((r) => r.nombre));

    } catch (error) {
        console.error("Error al listar entidades:", error);
        res.status(500).json({ mensaje: "Error al listar entidades", error: error.message });
    }
});

// =====================================================
// LISTA DE PERIODOS (años)
//   GET /api/comparar/periodos
// =====================================================

router.get("/periodos", async (req, res) => {
    try {
        const c = await obtenerConfig();

        if (!c.fecha) return res.json([]);

        const [rows] = await pool.query(`
            SELECT DISTINCT YEAR(\`${c.fecha}\`) AS anio
            FROM ${VISTA}
            WHERE \`${c.fecha}\` IS NOT NULL
            ORDER BY 1 DESC
        `);

        res.json(rows.map((r) => r.anio).filter((a) => a));

    } catch (error) {
        console.error("Error al listar periodos:", error);
        res.status(500).json({ mensaje: "Error al listar periodos", error: error.message });
    }
});

// =====================================================
// COMPARAR ENTIDADES
//   GET /api/comparar?entidad=A&entidad=B&entidad=C&anio=2024
//       (opcional: &campoEntidad=COLUMNA&campoFecha=COLUMNA)
// =====================================================

router.get("/", async (req, res) => {
    try {
        const base = await obtenerConfig();
        const c = { ...base };

        // El front envía las columnas que detectó en los datos
        const ce = String(req.query.campoEntidad || "");
        const cf = String(req.query.campoFecha || "");
        if (ce && base.todas.includes(ce)) c.entidad = ce;
        if (cf && base.todas.includes(cf)) c.fecha = cf;

        if (!c.entidad) {
            return res.status(500).json({ mensaje: "No se detectó la columna de entidad" });
        }

        let entidades = req.query.entidad || [];
        if (!Array.isArray(entidades)) entidades = [entidades];
        entidades = [...new Set(entidades.map((e) => String(e).trim()).filter(Boolean))];

        if (entidades.length < 2 || entidades.length > 3) {
            return res.status(400).json({
                mensaje: "Selecciona entre 2 y 3 entidades distintas"
            });
        }

        const anio = parseInt(req.query.anio, 10);
        const filtrarAnio = c.fecha && !isNaN(anio);

        const marcadores = entidades.map(() => "?").join(", ");
        const where = `TRIM(\`${c.entidad}\`) IN (${marcadores})` +
            (filtrarAnio ? ` AND YEAR(\`${c.fecha}\`) = ?` : "");
        const params = filtrarAnio ? [...entidades, anio] : [...entidades];

        // Totales por entidad
        const [totales] = await pool.query(`
            SELECT
                TRIM(\`${c.entidad}\`) AS entidad,
                COUNT(*) AS procesos,
                ${suma(c.montoRef)} AS montoReferencial,
                ${suma(c.montoAdj)} AS montoAdjudicado,
                ${suma(c.montoCont)} AS montoContratado
            FROM ${VISTA}
            WHERE ${where}
            GROUP BY TRIM(\`${c.entidad}\`)
        `, params);

        // Monto por mes (contratado; si no existe, referencial)
        const colMensual = c.montoCont || c.montoRef;
        let mensuales = [];

        if (c.fecha && colMensual) {
            [mensuales] = await pool.query(`
                SELECT
                    TRIM(\`${c.entidad}\`) AS entidad,
                    MONTH(\`${c.fecha}\`) AS mes,
                    SUM(\`${colMensual}\`) AS monto
                FROM ${VISTA}
                WHERE ${where} AND \`${c.fecha}\` IS NOT NULL
                GROUP BY TRIM(\`${c.entidad}\`), MONTH(\`${c.fecha}\`)
            `, params);
        }

        // Respetar el orden elegido por el usuario
        const resultado = entidades.map((nombre) => {
            const t = totales.find((r) => String(r.entidad).trim() === nombre);

            const mensual = Array(12).fill(0);
            mensuales
                .filter((m) => String(m.entidad).trim() === nombre && m.mes >= 1 && m.mes <= 12)
                .forEach((m) => { mensual[m.mes - 1] = aNumero(m.monto) || 0; });

            return {
                nombre,
                procesos: t ? Number(t.procesos) : 0,
                montoReferencial: t ? aNumero(t.montoReferencial) : 0,
                montoAdjudicado: t ? aNumero(t.montoAdjudicado) : 0,
                montoContratado: t ? aNumero(t.montoContratado) : 0,
                mensual
            };
        });

        res.json({
            anio: filtrarAnio ? anio : null,
            disponibles: {
                referencial: !!c.montoRef,
                adjudicado: !!c.montoAdj,
                contratado: !!c.montoCont
            },
            entidades: resultado
        });

    } catch (error) {
        console.error("Error al comparar entidades:", error);
        res.status(500).json({ mensaje: "Error al comparar entidades", error: error.message });
    }
});

module.exports = router;