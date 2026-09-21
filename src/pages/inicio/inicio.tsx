import "./Inicio.css";

function Inicio() {
  return (
    <div className="inicio">

      {/* ==================================================
          CONTENIDO PRINCIPAL
      ================================================== */}
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

              {/* ==========================================
                  ESTE DATO POSTERIORMENTE VENDRÁ DE LA BD
              ========================================== */}
              <strong>12,458</strong>

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

              {/* ==========================================
                  ESTE DATO POSTERIORMENTE VENDRÁ DE LA BD
              ========================================== */}
              <strong>S/ 3,256 M</strong>

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

              {/* ==========================================
                  ESTE DATO POSTERIORMENTE VENDRÁ DE LA BD
              ========================================== */}
              <strong>S/ 2,945 M</strong>

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

              {/* ==========================================
                  ESTE DATO POSTERIORMENTE VENDRÁ DE LA BD
              ========================================== */}
              <strong>S/ 3,021 M</strong>

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

          {/* ==================================================
              GRÁFICA 1
          ================================================== */}
          <div className="grafica-card">

            <div className="grafica-header">

              <h3>
                Evolución del monto contratado
              </h3>

              <span>
                (Millones de soles)
              </span>

            </div>


            {/* ==================================================
                AQUÍ VA LA GRÁFICA

                Posteriormente reemplazaremos este contenido
                por una gráfica conectada a los datos de la BD.
            ================================================== */}
            <div className="grafica-placeholder">

              <p>
                Grafica
              </p>

            </div>

          </div>


          {/* ==================================================
              GRÁFICA 2
          ================================================== */}
          <div className="grafica-card">

            <div className="grafica-header">

              <h3>
                Monto referencial vs. adjudicado vs. contratado
              </h3>

              <span>
                (Millones de soles)
              </span>

            </div>


            {/* ==================================================
                AQUÍ VA LA GRÁFICA

                Posteriormente reemplazaremos este contenido
                por una gráfica conectada a los datos de la BD.
            ================================================== */}
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


      {/* ==================================================
          FOOTER
      ================================================== */}
      <footer className="footer">

        <span>
          Fuente de datos: SEACE - Datos Abiertos
        </span>

        <span>
          Última actualización: 20/05/2024 10:30 a. m.
        </span>

      </footer>

    </div>
  );
}

export default Inicio;