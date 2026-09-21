import "./procesos.css";

function Procesos() {
  return (
    <div className="procesos-page">

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}
      <main className="procesos-contenido">

        {/* =====================================================
            ENCABEZADO
        ====================================================== */}
        <section className="procesos-header">

          <div>
            <h1>
              Procesos de contratación
            </h1>

            <p>
              Consulta y filtra los procesos de contratación
              de obras públicas registrados.
            </p>
          </div>

          {/* Este dato posteriormente vendrá de la BD */}
          <div className="procesos-total">
            <span>
              Procesos registrados
            </span>

            <strong>
              12,458
            </strong>
          </div>

        </section>


        {/* =====================================================
            FILTROS
        ====================================================== */}
        <section className="filtros-card">

          <div className="filtros-header">

            <h2>
              Buscar procesos
            </h2>

            <button
              type="button"
              className="limpiar-filtros"
            >
              Limpiar filtros
            </button>

          </div>


          <div className="filtros">

            {/* BUSCADOR */}
            <div className="filtro-grupo">

              <label htmlFor="buscar">
                Buscar
              </label>

              <input
                id="buscar"
                type="text"
                placeholder="Código, proceso, entidad o proveedor..."
              />

            </div>


            {/* ENTIDAD */}
            <div className="filtro-grupo">

              <label htmlFor="entidad">
                Entidad
              </label>

              <select id="entidad">

                <option value="">
                  Todas las entidades
                </option>

                <option value="muni">
                  Municipalidad
                </option>

                <option value="gobierno">
                  Gobierno Regional
                </option>

              </select>

            </div>


            {/* ESTADO */}
            <div className="filtro-grupo">

              <label htmlFor="estado">
                Estado
              </label>

              <select id="estado">

                <option value="">
                  Todos los estados
                </option>

                <option value="convocado">
                  Convocado
                </option>

                <option value="adjudicado">
                  Adjudicado
                </option>

                <option value="contratado">
                  Contratado
                </option>

              </select>

            </div>


            {/* FECHA */}
            <div className="filtro-grupo">

              <label htmlFor="fecha">
                Fecha
              </label>

              <select id="fecha">

                <option value="">
                  Todas las fechas
                </option>

                <option value="2026">
                  2026
                </option>

                <option value="2025">
                  2025
                </option>

                <option value="2024">
                  2024
                </option>

              </select>

            </div>


            <button
              type="button"
              className="buscar-button"
            >
              Buscar
            </button>

          </div>

        </section>


        {/* =====================================================
            TABLA DE PROCESOS
        ====================================================== */}
        <section className="tabla-card">

          <div className="tabla-header">

            <div>

              <h2>
                Procesos registrados
              </h2>

              <p>
                Resultados de búsqueda
              </p>

            </div>

            <span className="resultado-count">
              4 resultados
            </span>

          </div>


          <div className="tabla-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Código
                  </th>

                  <th>
                    Entidad
                  </th>

                  <th>
                    Objeto de contratación
                  </th>

                  <th>
                    Monto referencial
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Acción
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* =================================================
                    DATOS TEMPORALES

                    Estos datos posteriormente serán reemplazados
                    por información obtenida desde la API / BD.
                ================================================== */}

                <tr>

                  <td>
                    LP-001-2026
                  </td>

                  <td>
                    Municipalidad Provincial
                  </td>

                  <td>
                    Mejoramiento de infraestructura vial
                  </td>

                  <td>
                    S/ 1,250,000
                  </td>

                  <td>
                    <span className="estado contratado">
                      Contratado
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ver-button"
                    >
                      Ver
                    </button>
                  </td>

                </tr>


                <tr>

                  <td>
                    AS-002-2026
                  </td>

                  <td>
                    Gobierno Regional
                  </td>

                  <td>
                    Construcción de institución educativa
                  </td>

                  <td>
                    S/ 850,000
                  </td>

                  <td>
                    <span className="estado adjudicado">
                      Adjudicado
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ver-button"
                    >
                      Ver
                    </button>
                  </td>

                </tr>


                <tr>

                  <td>
                    LP-003-2026
                  </td>

                  <td>
                    Municipalidad Distrital
                  </td>

                  <td>
                    Construcción de sistema de agua potable
                  </td>

                  <td>
                    S/ 2,100,000
                  </td>

                  <td>
                    <span className="estado convocado">
                      Convocado
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ver-button"
                    >
                      Ver
                    </button>
                  </td>

                </tr>


                <tr>

                  <td>
                    AS-004-2026
                  </td>

                  <td>
                    Gobierno Regional
                  </td>

                  <td>
                    Rehabilitación de carretera
                  </td>

                  <td>
                    S/ 3,500,000
                  </td>

                  <td>
                    <span className="estado contratado">
                      Contratado
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="ver-button"
                    >
                      Ver
                    </button>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          {/* =====================================================
              PAGINACIÓN

              Posteriormente será dinámica según los resultados
              obtenidos desde la API.
          ====================================================== */}
          <div className="paginacion">

            <button
              type="button"
              disabled
            >
              ← Anterior
            </button>

            <span>
              Página 1 de 10
            </span>

            <button
              type="button"
            >
              Siguiente →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Procesos;