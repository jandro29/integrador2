import { useEffect, useState } from "react";
import "./inicio.css";


interface Estadisticas {
  procesos: number;
  montoReferencial: number;
  montoAdjudicado: number;
  montoContratado: number;
}

function Inicio() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    procesos: 0,
    montoReferencial: 0,
    montoAdjudicado: 0,
    montoContratado: 0,
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

        setEstadisticas(datos);
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

  return (
    <div className="inicio">

      <main className="contenido">

        {/* ==================================================
            HERO
        ================================================== */}
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


        {/* ==================================================
            TARJETAS DE ESTADÍSTICAS
        ================================================== */}
        <section className="estadisticas">

          {/* PROCESOS REGISTRADOS */}
          <div className="estadistica-card">

            <div className="estadistica-icon azul">
              📄
            </div>

            <div>

              <span className="estadistica-label">
                Procesos registrados
              </span>

              <strong>
                {cargando
                  ? "Cargando..."
                  : estadisticas.procesos.toLocaleString("es-PE")}
              </strong>

              <small>
                Total de procesos
              </small>

            </div>

          </div>


          {/* MONTO REFERENCIAL */}
          <div className="estadistica-card">

            <div className="estadistica-icon azul">
              S/
            </div>

            <div>

              <span className="estadistica-label">
                Monto referencial
              </span>

              <strong>
                {cargando
                  ? "Cargando..."
                  : formatearMonto(estadisticas.montoReferencial)}
              </strong>

              <small>
                Monto total
              </small>

            </div>

          </div>


          {/* MONTO ADJUDICADO */}
          <div className="estadistica-card">

            <div className="estadistica-icon verde">
              💰
            </div>

            <div>

              <span className="estadistica-label">
                Monto adjudicado
              </span>

              <strong>
                {cargando
                  ? "Cargando..."
                  : formatearMonto(estadisticas.montoAdjudicado)}
              </strong>

              <small>
                Monto total
              </small>

            </div>

          </div>


          {/* MONTO CONTRATADO */}
          <div className="estadistica-card">

            <div className="estadistica-icon celeste">
              💼
            </div>

            <div>

              <span className="estadistica-label">
                Monto contratado
              </span>

              <strong>
                {cargando
                  ? "Cargando..."
                  : formatearMonto(estadisticas.montoContratado)}
              </strong>

              <small>
                Monto total
              </small>

            </div>

          </div>

        </section>


        {/* ==================================================
            DASHBOARD
        ================================================== */}
        <section className="dashboard">

          <div className="grafica-card">

            <div className="grafica-header">

              <h3>
                Evolución del monto contratado
              </h3>

              <span>
                (Millones de soles)
              </span>

            </div>

            <div className="grafica-placeholder">

              <p>
                Grafica
              </p>

            </div>

          </div>


          <div className="grafica-card">

            <div className="grafica-header">

              <h3>
                Monto referencial vs. adjudicado vs. contratado
              </h3>

              <span>
                (Millones de soles)
              </span>

            </div>

            <div className="grafica-placeholder">

              <p>
                Grafica
              </p>

            </div>

          </div>


          {/* ==================================================
              SEÑALES PARA REVISIÓN
          ================================================== */}
          <div className="revision-card">

            <div className="revision-title">

              <span>
                ⚠️
              </span>

              <h3>
                Señales para revisión
              </h3>

            </div>

            <p>
              Se identificaron procesos con variaciones
              importantes entre el monto referencial y
              el monto adjudicado.
            </p>

            <button
              type="button"
              className="revision-button"
            >
              Ver más señales →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Inicio;