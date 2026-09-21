import "./procesoDetalle.css";

function ProcesoDetalle() {
  return (
    <div className="detalle-page">

      <main className="detalle-contenido">

        {/* =====================================================
            VOLVER
        ====================================================== */}
        <button
          type="button"
          className="volver-resultados"
          onClick={() => window.history.back()}
        >
          ← Volver a resultados
        </button>


        {/* =====================================================
            TÍTULO
        ====================================================== */}
        <h1>
          Detalle del proceso
        </h1>


        {/* =====================================================
            INFORMACIÓN GENERAL
        ====================================================== */}
        <section className="info-general">

          <div className="info-item">
            <span>Código del proceso</span>

            {/* Este dato posteriormente vendrá de la BD */}
            <strong>
              LP-001-2024-MDSM/CS-1
            </strong>
          </div>


          <div className="info-item">
            <span>Estado</span>

            <span className="estado-detalle">
              Contrato firmado
            </span>
          </div>


          <div className="info-item">
            <span>Entidad</span>

            <strong>
              Municipalidad Distrital de San Miguel
            </strong>
          </div>


          <div className="info-item">
            <span>Ubicación</span>

            <strong>
              San Miguel, Lima, Lima
            </strong>
          </div>


          <div className="info-item">
            <span>Tipo de proceso</span>

            <strong>
              Licitación Pública
            </strong>
          </div>


          <div className="descripcion-general">

            <strong>
              Descripción:
            </strong>

            <span>
              Mejoramiento de pistas y veredas en el
              Jr. Los Pinos, San Miguel
            </span>

          </div>

        </section>


        {/* =====================================================
            ETAPAS DEL PROCESO
        ====================================================== */}
        <section className="etapas">

          <div className="etapa">

            <div className="etapa-numero">
              1
            </div>

            <div className="etapa-info">

              <strong>
                CONVOCATORIA
              </strong>

              <span>
                15/03/2024
              </span>

            </div>

          </div>


          <div className="etapa-linea"></div>


          <div className="etapa">

            <div className="etapa-numero verde">
              2
            </div>

            <div className="etapa-info">

              <strong>
                ADJUDICACIÓN
              </strong>

              <span>
                25/03/2024
              </span>

            </div>

          </div>


          <div className="etapa-linea verde-linea"></div>


          <div className="etapa">

            <div className="etapa-numero">
              3
            </div>

            <div className="etapa-info">

              <strong>
                CONTRATO
              </strong>

              <span>
                05/04/2024
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            INFORMACIÓN DE LAS ETAPAS
        ====================================================== */}
        <section className="detalle-grid">


          {/* =================================================
              CONVOCATORIA
          ================================================== */}
          <div className="detalle-card">

            <h2>
              1. CONVOCATORIA
            </h2>

            <div className="detalle-datos">

              <div>
                <span>Entidad</span>
                <strong>
                  Municipalidad Distrital de San Miguel
                </strong>
              </div>

              <div>
                <span>Descripción</span>
                <strong>
                  Mejoramiento de pistas y veredas en el Jr.
                  Los Pinos, San Miguel
                </strong>
              </div>

              <div>
                <span>Objeto contractual</span>
                <strong>
                  Obra
                </strong>
              </div>

              <div>
                <span>Tipo de proceso</span>
                <strong>
                  Licitación Pública
                </strong>
              </div>

              <div>
                <span>Sistema de contratación</span>
                <strong>
                  A Suma Alzada
                </strong>
              </div>

              <div>
                <span>Monto referencial</span>
                <strong>
                  S/ 1,250,000.00
                </strong>
              </div>

              <div>
                <span>Fecha de convocatoria</span>
                <strong>
                  15/03/2024
                </strong>
              </div>

            </div>

          </div>


          {/* =================================================
              ADJUDICACIÓN
          ================================================== */}
          <div className="detalle-card">

            <h2>
              2. ADJUDICACIÓN
            </h2>

            <div className="detalle-datos">

              <div>
                <span>Proveedor ganador</span>
                <strong>
                  Constructora Pacifico S.A.C.
                </strong>
              </div>

              <div>
                <span>RUC</span>
                <strong>
                  20601234567
                </strong>
              </div>

              <div>
                <span>Tipo de proveedor</span>
                <strong>
                  Sociedad Anónima Cerrada
                </strong>
              </div>

              <div>
                <span>Monto adjudicado</span>

                <strong className="monto-verde">
                  S/ 1,187,500.00
                </strong>
              </div>

              <div>
                <span>Fecha de Buena Pro</span>
                <strong>
                  25/03/2024
                </strong>
              </div>

              <div>
                <span>Fecha de consentimiento</span>
                <strong>
                  28/03/2024
                </strong>
              </div>

            </div>

          </div>


          {/* =================================================
              CONTRATO
          ================================================== */}
          <div className="detalle-card">

            <h2>
              3. CONTRATO
            </h2>

            <div className="detalle-datos">

              <div>
                <span>N° de contrato</span>
                <strong>
                  023-2024-MDSM
                </strong>
              </div>

              <div>
                <span>Contratista</span>
                <strong>
                  Constructora Pacifico S.A.C.
                </strong>
              </div>

              <div>
                <span>Monto contratado</span>

                <strong className="monto-azul">
                  S/ 1,225,375.00
                </strong>
              </div>

              <div>
                <span>Fecha de firma</span>
                <strong>
                  05/04/2024
                </strong>
              </div>

              <div>
                <span>Fecha de inicio</span>
                <strong>
                  08/04/2024
                </strong>
              </div>

              <div>
                <span>Fecha de finalización</span>
                <strong>
                  08/10/2024
                </strong>
              </div>

              <div>
                <span>Adicionales</span>
                <strong>
                  S/ 37,875.00
                </strong>
              </div>

              <div>
                <span>Reducciones</span>
                <strong>
                  S/ 0.00
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            COMPARACIÓN DE MONTOS
        ====================================================== */}
        <section className="montos-seccion">

          <div className="montos-card">

            <h2>
              Comparación de montos
            </h2>


            <div className="montos">

              <div className="monto-box">

                <span>
                  Monto referencial
                </span>

                <strong>
                  S/ 1,250,000.00
                </strong>

              </div>


              <span className="flecha">
                →
              </span>


              <div className="monto-box adjudicado">

                <span>
                  Monto adjudicado
                </span>

                <strong>
                  S/ 1,187,500.00
                </strong>

              </div>


              <span className="flecha">
                →
              </span>


              <div className="monto-box contratado">

                <span>
                  Monto contratado
                </span>

                <strong>
                  S/ 1,225,375.00
                </strong>

              </div>


              <div className="variaciones">

                <div>
                  Variación referencial → adjudicado

                  <strong className="variacion-negativa">
                    -5.00%
                  </strong>
                </div>

                <div>
                  Variación adjudicado → contratado

                  <strong className="variacion-positiva">
                    +3.19% ↑
                  </strong>
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              ALERTA
          ================================================== */}
          <div className="alerta-card">

            <h2>
              ⚠️ Variación relevante
            </h2>

            <p>
              El monto presenta una variación respecto al
              valor de referencia. Esta información constituye
              una señal para revisión y no determina por sí
              misma una irregularidad.
            </p>

          </div>

        </section>


        {/* =====================================================
            BOTONES
        ====================================================== */}
        <section className="acciones">

          <div>

            <button
              type="button"
              className="exportar pdf"
            >
              ▢ Exportar PDF
            </button>

            <button
              type="button"
              className="exportar excel"
            >
              ▣ Exportar Excel
            </button>

          </div>


          <button
            type="button"
            className="volver-button"
            onClick={() => window.history.back()}
          >
            ← Volver a resultados
          </button>

        </section>

      </main>

    </div>
  );
}

export default ProcesoDetalle;