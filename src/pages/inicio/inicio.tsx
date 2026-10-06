import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import "./inicio.css";

interface PuntoEvolucion {
  anio: string;
  monto: number;
}

interface Estadisticas {
  procesos: number;
  montoReferencial: number;
  montoAdjudicado: number;
  montoContratado: number;
  evolucion: PuntoEvolucion[];
}

function Inicio() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    procesos: 0,
    montoReferencial: 0,
    montoAdjudicado: 0,
    montoContratado: 0,
    evolucion: [],
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:3000/api/estadisticas"
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener las estadísticas");
        }

        const datos = await respuesta.json();

        setEstadisticas({
          ...datos,
          evolucion: datos.evolucion ?? [],
        });
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerEstadisticas();
  }, []);

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      maximumFractionDigits: 2,
    }).format(monto);
  };

  // ---------- Datos para las gráficas ----------
  const aMillones = (monto: number) => Number((monto / 1_000_000).toFixed(2));

  const datosEvolucion = estadisticas.evolucion.map((p) => ({
    anio: p.anio,
    monto: aMillones(p.monto),
  }));

  const datosComparacion = [
    { nombre: "Referencial", monto: aMillones(estadisticas.montoReferencial), color: "#2563eb" },
    { nombre: "Adjudicado", monto: aMillones(estadisticas.montoAdjudicado), color: "#16a34a" },
    { nombre: "Contratado", monto: aMillones(estadisticas.montoContratado), color: "#0ea5e9" },
  ];

  const formatearTooltip = (valor: unknown): [string, string] => [
    `S/ ${Number(valor).toLocaleString("es-PE")} M`,
    "Monto",
  ];

  return (
    <div className="inicio">

      <main className="contenido">

        {/* ==================== HERO ==================== */}
        <section className="hero">

          <div className="hero-info">

            <h1>
              Consulta y comprende
              <br />
              las contrataciones de obras públicas
            </h1>

            <p>
              Consulta información integrada sobre convocatorias,
              adjudicaciones y contratos a partir de datos públicos.
            </p>

            <div className="buscador">

              <input
                type="text"
                placeholder="Buscar proceso, entidad o proveedor..."
              />

              <button type="button">
                🔍
              </button>

            </div>

          </div>

          <div className="hero-ilustracion">
            🏗️
          </div>

        </section>


        {/* ============ TARJETAS DE ESTADÍSTICAS ============ */}
        <section className="estadisticas">

          <div className="estadistica-card">
            <div className="estadistica-icon azul">📄</div>
            <div>
              <span className="estadistica-label">Procesos registrados</span>
              <strong>
                {cargando
                  ? "Cargando..."
                  : estadisticas.procesos.toLocaleString("es-PE")}
              </strong>
              <small>Total de procesos</small>
            </div>
          </div>

          <div className="estadistica-card">
            <div className="estadistica-icon azul">S/</div>
            <div>
              <span className="estadistica-label">Monto referencial</span>
              <strong>
                {cargando
                  ? "Cargando..."
                  : formatearMonto(estadisticas.montoReferencial)}
              </strong>
              <small>Monto total</small>
            </div>
          </div>

          <div className="estadistica-card">
            <div className="estadistica-icon verde">💰</div>
            <div>
              <span className="estadistica-label">Monto adjudicado</span>
              <strong>
                {cargando
                  ? "Cargando..."
                  : formatearMonto(estadisticas.montoAdjudicado)}
              </strong>
              <small>Monto total</small>
            </div>
          </div>

          <div className="estadistica-card">
            <div className="estadistica-icon celeste">💼</div>
            <div>
              <span className="estadistica-label">Monto contratado</span>
              <strong>
                {cargando
                  ? "Cargando..."
                  : formatearMonto(estadisticas.montoContratado)}
              </strong>
              <small>Monto total</small>
            </div>
          </div>

        </section>


        {/* ==================== DASHBOARD ==================== */}
        <section className="dashboard">

          {/* GRÁFICA 1: EVOLUCIÓN */}
          <div className="grafica-card">

            <div className="grafica-header">
              <h3>Evolución del monto contratado</h3>
              <span>(Millones de soles)</span>
            </div>

            <div className="grafica-placeholder">
              {cargando ? (
                <p>Cargando...</p>
              ) : datosEvolucion.length === 0 ? (
                <p>No hay datos para mostrar</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={datosEvolucion}>
                    <defs>
                      <linearGradient id="degradado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="anio" />
                    <YAxis />
                    <Tooltip formatter={formatearTooltip} />
                    <Area
                      type="monotone"
                      dataKey="monto"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#degradado)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>


          {/* GRÁFICA 2: COMPARACIÓN */}
          <div className="grafica-card">

            <div className="grafica-header">
              <h3>Monto referencial vs. adjudicado vs. contratado</h3>
              <span>(Millones de soles)</span>
            </div>

            <div className="grafica-placeholder">
              {cargando ? (
                <p>Cargando...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosComparacion}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip formatter={formatearTooltip} />
                    <Bar dataKey="monto" radius={[6, 6, 0, 0]}>
                      {datosComparacion.map((d) => (
                        <Cell key={d.nombre} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>


          {/* SEÑALES PARA REVISIÓN */}
          <div className="revision-card">

            <div className="revision-title">
              <span>⚠️</span>
              <h3>Señales para revisión</h3>
            </div>

            <p>
              Se identificaron procesos con variaciones
              importantes entre el monto referencial y
              el monto adjudicado.
            </p>

            <button type="button" className="revision-button">
              Ver más señales →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Inicio;