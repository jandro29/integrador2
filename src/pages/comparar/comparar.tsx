import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import "./comparar.css";

const API = "http://localhost:3000/api/comparar";
const API_PROCESOS = "http://localhost:3000/api/procesos";
const MAX_ENTIDADES = 3;

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const COLORES_ENTIDAD = ["#2563eb", "#16a34a", "#f59e0b"];

const CAMPOS_ENTIDAD = ["entidad", "nombre_entidad", "entidad_nombre"];
const CAMPOS_FECHA = ["fecha_convocatoria", "fecha", "fecha_proceso"];

// Busca el nombre real de una columna en una fila de datos
const detectarCampo = (fila: Record<string, any>, candidatos: string[], regex: RegExp) =>
  candidatos.find((c) => fila[c] !== undefined) ||
  Object.keys(fila).find((k) => regex.test(k)) ||
  "";

interface EntidadResultado {
  nombre: string;
  procesos: number;
  montoReferencial: number | null;
  montoAdjudicado: number | null;
  montoContratado: number | null;
  mensual: number[];
}

interface Resultado {
  anio: number | null;
  disponibles: { referencial: boolean; adjudicado: boolean; contratado: boolean };
  entidades: EntidadResultado[];
}

// "Municipalidad Distrital de San Miguel" -> "San Miguel"
const nombreCorto = (nombre: string) =>
  nombre.replace(/^municipalidad\s+(distrital|provincial)?\s*(de|del)?\s*/i, "").trim() || nombre;

const formatearSoles = (valor: number | null) =>
  valor === null || valor === undefined
    ? "—"
    : new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(valor);

// Variación de A respecto a B
const calcularVariacion = (a: number | null, b: number | null) => {
  if (a === null || b === null || b === 0) return null;
  return ((a - b) / b) * 100;
};

// Convierte "S/ 1,200.50" en 1200.5
const aNum = (v: any) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};

const anioDe = (v: any) => {
  const m = String(v ?? "").match(/(19|20)\d{2}/);
  return m ? m[0] : "";
};

const mesDe = (v: any) => {
  const s = String(v ?? "");
  let m = s.match(/^(\d{4})-(\d{2})/);
  if (m) return Number(m[2]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? Number(m[2]) : 0;
};

// Calcula la comparación en el navegador (plan B si el servidor falla)
const calcularLocal = (
  datos: Record<string, any>[],
  nombres: string[],
  anio: string,
  cEnt: string,
  cFecha: string
): Resultado => {

  const claves = Object.keys(datos[0] || {});
  const col = (rxs: RegExp[]) => {
    for (const rx of rxs) {
      const k = claves.find((c) => rx.test(c));
      if (k) return k;
    }
    return "";
  };

  const cRef = col([/^monto_referencial$/i, /^monto_referencia$/i, /^valor_referencial$/i, /referencial/i]);
  const cAdj = col([/monto.*adjudic/i, /valor.*adjudic/i, /adjudic.*monto/i]);
  const cCont = col([/monto.*contrat/i, /valor.*contrat/i, /contrat.*monto/i]);
  const cMensual = cCont || cRef;

  const entidades = nombres.map((nombre) => {

    const filas = datos.filter(
      (p) =>
        String(p[cEnt] ?? "").trim() === nombre &&
        (!anio || anioDe(p[cFecha]) === anio)
    );

    const sumar = (c: string) => (c ? filas.reduce((t, p) => t + aNum(p[c]), 0) : null);

    const mensual = Array(12).fill(0);
    if (cMensual && cFecha) {
      filas.forEach((p) => {
        const mes = mesDe(p[cFecha]);
        if (mes >= 1 && mes <= 12) mensual[mes - 1] += aNum(p[cMensual]);
      });
    }

    return {
      nombre,
      procesos: filas.length,
      montoReferencial: sumar(cRef),
      montoAdjudicado: sumar(cAdj),
      montoContratado: sumar(cCont),
      mensual
    };
  });

  return {
    anio: anio ? Number(anio) : null,
    disponibles: { referencial: !!cRef, adjudicado: !!cAdj, contratado: !!cCont },
    entidades
  };
};

function Comparar() {

  const [entidades, setEntidades] = useState<{ nombre: string; procesos: number }[]>([]);
  const [anios, setAnios] = useState<number[]>([]);
  const [campoEntidad, setCampoEntidad] = useState("");
  const [campoFecha, setCampoFecha] = useState("");

  const [buscar, setBuscar] = useState("");
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [anio, setAnio] = useState("");

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [comparando, setComparando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [todos, setTodos] = useState<Record<string, any>[]>([]);


  // ---------- Cargar entidades y años desde /api/procesos ----------

  useEffect(() => {

    const cargarOpciones = async () => {
      try {
        const respuesta = await fetch(API_PROCESOS);
        if (!respuesta.ok) throw new Error("Error al obtener procesos");

        const datos = await respuesta.json();
        if (!Array.isArray(datos) || datos.length === 0) throw new Error("Sin datos");

        const cEntidad = detectarCampo(datos[0], CAMPOS_ENTIDAD, /entidad/i);
        const cFecha = detectarCampo(datos[0], CAMPOS_FECHA, /fecha/i);

        setTodos(datos);
        setCampoEntidad(cEntidad);
        setCampoFecha(cFecha);

        // Entidades únicas con su cantidad de procesos
        const conteo = new Map<string, number>();
        const aniosSet = new Set<number>();

        datos.forEach((p: Record<string, any>) => {
          const nombre = cEntidad ? String(p[cEntidad] ?? "").trim() : "";
          if (nombre) conteo.set(nombre, (conteo.get(nombre) || 0) + 1);

          const m = cFecha ? String(p[cFecha] ?? "").match(/(19|20)\d{2}/) : null;
          if (m) aniosSet.add(Number(m[0]));
        });

        setEntidades(
          Array.from(conteo.entries())
            .map(([nombre, procesos]) => ({ nombre, procesos }))
            .sort((x, y) => x.nombre.localeCompare(y.nombre, "es"))
        );

        const listaAnios = Array.from(aniosSet).sort((x, y) => y - x);
        setAnios(listaAnios);
        if (listaAnios.length > 0) setAnio(String(listaAnios[0]));

      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las entidades desde la base de datos.");
      } finally {
        setCargando(false);
      }
    };

    cargarOpciones();

  }, []);


  // ---------- Selección con checkbox ----------

  const alternar = (nombre: string) => {
    setSeleccionadas((prev) => {
      if (prev.includes(nombre)) return prev.filter((n) => n !== nombre);
      if (prev.length >= MAX_ENTIDADES) return prev;
      return [...prev, nombre];
    });
  };

  const texto = buscar.trim().toLowerCase();

  const entidadesVisibles = entidades
    .filter((e) => texto === "" || e.nombre.toLowerCase().includes(texto))
    .slice(0, 100);


  // ---------- Comparar ----------

  const comparar = async () => {

    if (seleccionadas.length < 2) {
      setError("Selecciona al menos 2 entidades para comparar.");
      return;
    }

    setComparando(true);
    setError("");
    setAviso("");

    try {

      // 1) Intento con el backend
      const query =
        seleccionadas.map((e) => `entidad=${encodeURIComponent(e)}`).join("&") +
        `&campoEntidad=${encodeURIComponent(campoEntidad)}` +
        `&campoFecha=${encodeURIComponent(campoFecha)}` +
        (anio ? `&anio=${encodeURIComponent(anio)}` : "");

      const url = `${API}?${query}`;
      console.log("Comparando:", url);

      const respuesta = await fetch(url);
      const datos = await respuesta.json().catch(() => null);

      console.log("Respuesta:", respuesta.status, datos);

      if (!respuesta.ok || !datos?.entidades) {
        throw new Error(
          datos?.error || datos?.mensaje || `El servidor respondió ${respuesta.status}`
        );
      }

      setResultado(datos);

    } catch (err: any) {

      // 2) Plan B: calcular con los datos ya cargados
      console.warn("El backend falló, se calcula en el navegador:", err);

      if (todos.length === 0) {
        setError(`No se pudo realizar la comparación: ${err.message}`);
      } else {
        setResultado(calcularLocal(todos, seleccionadas, anio, campoEntidad, campoFecha));
        setAviso(`Resultado calculado desde la lista de procesos. Motivo: ${err.message}`);
      }

    } finally {

      setComparando(false);

    }
  };


  // ---------- Datos derivados para tabla y gráficas ----------

  const ents = resultado?.entidades ?? [];

  const indicadores: {
    etiqueta: string;
    clave: "procesos" | "montoReferencial" | "montoAdjudicado" | "montoContratado";
    moneda: boolean;
  }[] = [
    { etiqueta: "Procesos", clave: "procesos", moneda: false },
    { etiqueta: "Monto referencial", clave: "montoReferencial", moneda: true },
    { etiqueta: "Monto adjudicado", clave: "montoAdjudicado", moneda: true },
    { etiqueta: "Monto contratado", clave: "montoContratado", moneda: true }
  ];

  const datosMensual = MESES.map((mes, i) => {
    const fila: Record<string, any> = { mes };
    ents.forEach((e, idx) => { fila[`e${idx}`] = Number((e.mensual[i] / 1_000_000).toFixed(2)); });
    return fila;
  });

  const datosMontos = ents.map((e) => ({
    entidad: nombreCorto(e.nombre),
    Referencial: Number(((e.montoReferencial ?? 0) / 1_000_000).toFixed(2)),
    Adjudicado: Number(((e.montoAdjudicado ?? 0) / 1_000_000).toFixed(2)),
    Contratado: Number(((e.montoContratado ?? 0) / 1_000_000).toFixed(2))
  }));

  const formatoMillones = (v: any) => `S/ ${Number(v).toFixed(2)} M`;


  return (
    <div className="comparar-page">

      <main className="comparar-contenido">

        {/* TÍTULO */}

        <section className="comparar-header">
          <h1>Comparar entidades</h1>
          <p>Selecciona hasta 3 entidades para comparar su información.</p>
        </section>


        {/* FILTROS */}

        <section className="comparar-filtros">

          <div className="filtro entidades-buscar">
            <label>
              Entidades <span>({seleccionadas.length} / {MAX_ENTIDADES} seleccionadas)</span>
            </label>
            <input
              type="text"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar entidad..."
            />
          </div>

          <div className="filtro periodo">
            <label>Periodo</label>
            <select value={anio} onChange={(e) => setAnio(e.target.value)}>
              <option value="">Todos los años</option>
              {anios.map((a) => (
                <option key={a} value={a}>Ene {a} - Dic {a}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="comparar-button"
            onClick={comparar}
            disabled={cargando || comparando}
          >
            {comparando ? "Comparando..." : "Comparar"}
          </button>

          <button
            type="button"
            className="comparar-button secundario"
            onClick={() => { setSeleccionadas([]); setResultado(null); setError(""); }}
          >
            Limpiar
          </button>

        </section>


        {/* LISTA DE ENTIDADES */}

        {!cargando && entidades.length > 0 && (
          <ul className="entidades-lista">
            {entidadesVisibles.length === 0 && (
              <li className="comparar-mensaje">No se encontraron entidades.</li>
            )}

            {entidadesVisibles.map((e) => {
              const marcada = seleccionadas.includes(e.nombre);
              const bloqueada = !marcada && seleccionadas.length >= MAX_ENTIDADES;

              return (
                <li key={e.nombre} className={marcada ? "activo" : ""}>
                  <label>
                    <input
                      type="checkbox"
                      checked={marcada}
                      disabled={bloqueada}
                      onChange={() => alternar(e.nombre)}
                    />
                    <span>{e.nombre}</span>
                    <em>{e.procesos.toLocaleString("es-PE")} procesos</em>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {cargando && <p className="comparar-mensaje">Cargando entidades...</p>}
        {error && <p className="comparar-mensaje comparar-error">{error}</p>}
        {aviso && <p className="comparar-mensaje">{aviso}</p>}


        {/* RESULTADOS */}

        {resultado && ents.length > 0 && (
          <>

            {/* TABLA */}

            <section className="tabla-comparacion">
              <table>

                <thead>
                  <tr>
                    <th>Indicador</th>
                    {ents.map((e) => <th key={e.nombre}>{e.nombre}</th>)}
                    <th>Variación (A vs B)</th>
                  </tr>
                </thead>

                <tbody>
                  {indicadores.map((ind) => {

                    const a = ents[0][ind.clave];
                    const b = ents[1][ind.clave];
                    const variacion = calcularVariacion(a, b);

                    return (
                      <tr key={ind.clave}>
                        <td>{ind.etiqueta}</td>

                        {ents.map((e) => (
                          <td key={e.nombre}>
                            {ind.moneda
                              ? formatearSoles(e[ind.clave])
                              : (e[ind.clave] ?? 0).toLocaleString("es-PE")}
                          </td>
                        ))}

                        <td
                          className={`variacion ${
                            variacion === null ? "" : variacion >= 0 ? "positiva" : "negativa"
                          }`}
                        >
                          {variacion === null
                            ? "—"
                            : `${variacion >= 0 ? "+" : ""}${variacion.toFixed(2)}% ${variacion >= 0 ? "↑" : "↓"}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </section>


            {/* GRÁFICAS */}

            <section className="graficas-comparar">

              {/* GRÁFICA 1 */}

              <div className="grafica-comparar-card">

                <div className="grafica-comparar-header">
                  <div>
                    <h2>Monto contratado por mes</h2>
                    <span>(Millones de soles)</span>
                  </div>

                  <div className="leyenda">
                    {ents.map((e, i) => (
                      <span key={e.nombre}>
                        <i className="punto" style={{ background: COLORES_ENTIDAD[i] }}></i>
                        {nombreCorto(e.nombre)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grafica-alto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosMensual}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={formatoMillones} />
                      {ents.map((e, i) => (
                        <Line
                          key={e.nombre}
                          type="monotone"
                          dataKey={`e${i}`}
                          name={nombreCorto(e.nombre)}
                          stroke={COLORES_ENTIDAD[i]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

              </div>


              {/* GRÁFICA 2 */}

              <div className="grafica-comparar-card">

                <div className="grafica-comparar-header">
                  <div>
                    <h2>Comparación de montos</h2>
                    <span>(Millones de soles)</span>
                  </div>

                  <div className="leyenda">
                    <span><i className="punto" style={{ background: "#38bdf8" }}></i>Referencial</span>
                    <span><i className="punto" style={{ background: "#16a34a" }}></i>Adjudicado</span>
                    <span><i className="punto" style={{ background: "#1e293b" }}></i>Contratado</span>
                  </div>
                </div>

                <div className="grafica-alto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosMontos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="entidad" />
                      <YAxis />
                      <Tooltip formatter={formatoMillones} />
                      {resultado.disponibles.referencial && <Bar dataKey="Referencial" fill="#38bdf8" />}
                      {resultado.disponibles.adjudicado && <Bar dataKey="Adjudicado" fill="#16a34a" />}
                      {resultado.disponibles.contratado && <Bar dataKey="Contratado" fill="#1e293b" />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default Comparar;