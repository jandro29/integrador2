import "./comparar.css";

function Comparar() {
  return (
    <div className="comparar-page">

      <main className="comparar-contenido">

        {/* =====================================================
            TÍTULO
        ====================================================== */}

        <section className="comparar-header">

          <h1>
            Comparar entidades
          </h1>

          <p>
            Selecciona hasta 3 entidades para comparar su información.
          </p>

        </section>


        {/* =====================================================
            FILTROS
        ====================================================== */}

        <section className="comparar-filtros">

          {/* ENTIDAD A */}

          <div className="filtro">

            <label>
              Entidad A
            </label>

            <select>

              <option>
                Municipalidad Distrital de San Miguel
              </option>

              <option>
                Municipalidad de Lima
              </option>

              <option>
                Municipalidad Distrital de Miraflores
              </option>

            </select>

          </div>


          {/* ENTIDAD B */}

          <div className="filtro">

            <label>
              Entidad B
            </label>

            <select>

              <option>
                Municipalidad Distrital de José L. Ortiz
              </option>

              <option>
                Municipalidad Distrital de San Isidro
              </option>

              <option>
                Municipalidad Provincial del Callao
              </option>

            </select>

          </div>


          {/* ENTIDAD C */}

          <div className="filtro">

            <label>
              Entidad C <span>(opcional)</span>
            </label>

            <select>

              <option>
                Seleccionar entidad
              </option>

              <option>
                Municipalidad de Lima
              </option>

              <option>
                Municipalidad Distrital de Surco
              </option>

            </select>

          </div>


          {/* PERIODO */}

          <div className="filtro periodo">

            <label>
              Periodo
            </label>

            <select>

              <option>
                Ene 2024 - Dic 2024
              </option>

              <option>
                Ene 2023 - Dic 2023
              </option>

              <option>
                Ene 2022 - Dic 2022
              </option>

            </select>

          </div>


          {/* BOTÓN */}

          <button
            type="button"
            className="comparar-button"
          >
            Comparar
          </button>

        </section>


        {/* =====================================================
            TABLA DE COMPARACIÓN
        ====================================================== */}

        <section className="tabla-comparacion">

          <table>

            <thead>

              <tr>

                <th>
                  Indicador
                </th>

                <th>
                  Municipalidad Distrital
                  <br />
                  San Miguel
                </th>

                <th>
                  Municipalidad Distrital
                  <br />
                  José L. Ortiz
                </th>

                <th>
                  Variación
                </th>

              </tr>

            </thead>


            <tbody>

              {/* PROCESOS */}

              <tr>

                <td>
                  Procesos
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  48
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  36
                </td>

                <td className="variacion positiva">
                  +33.33% ↑
                </td>

              </tr>


              {/* MONTO REFERENCIAL */}

              <tr>

                <td>
                  Monto referencial
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  S/ 5,200,000.00
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  S/ 3,650,000.00
                </td>

                <td className="variacion positiva">
                  +42.47% ↑
                </td>

              </tr>


              {/* MONTO ADJUDICADO */}

              <tr>

                <td>
                  Monto adjudicado
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  S/ 4,750,000.00
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  S/ 3,255,000.00
                </td>

                <td className="variacion positiva">
                  +45.90% ↑
                </td>

              </tr>


              {/* MONTO CONTRATADO */}

              <tr>

                <td>
                  Monto contratado
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  S/ 4,980,000.00
                </td>

                {/* Este dato posteriormente vendrá de la BD */}
                <td>
                  S/ 3,380,000.00
                </td>

                <td className="variacion positiva">
                  +47.34% ↑
                </td>

              </tr>

            </tbody>

          </table>

        </section>


        {/* =====================================================
            GRÁFICAS
        ====================================================== */}

        <section className="graficas-comparar">


          {/* =================================================
              GRÁFICA 1
          ================================================== */}

          <div className="grafica-comparar-card">

            <div className="grafica-comparar-header">

              <div>

                <h2>
                  Monto contratado por mes
                </h2>

                <span>
                  (Millones de soles)
                </span>

              </div>


              {/* LEYENDA */}

              <div className="leyenda">

                <span>
                  <i className="punto azul"></i>
                  San Miguel
                </span>

                <span>
                  <i className="punto verde"></i>
                  José L. Ortiz
                </span>

              </div>

            </div>


            {/* =================================================
                AQUÍ VA LA GRÁFICA
                Posteriormente conectar con BD/API
                Podemos utilizar Recharts o Chart.js
            ================================================== */}

            <div className="grafica-placeholder">

              <p>
                Gráfica
              </p>

            </div>

          </div>


          {/* =================================================
              GRÁFICA 2
          ================================================== */}

          <div className="grafica-comparar-card">

            <div className="grafica-comparar-header">

              <div>

                <h2>
                  Comparación de montos
                </h2>

                <span>
                  (Millones de soles)
                </span>

              </div>


              {/* LEYENDA */}

              <div className="leyenda">

                <span>
                  <i className="punto celeste"></i>
                  Referencial
                </span>

                <span>
                  <i className="punto verde"></i>
                  Adjudicado
                </span>

                <span>
                  <i className="punto oscuro"></i>
                  Contratado
                </span>

              </div>

            </div>


            {/* =================================================
                AQUÍ VA LA GRÁFICA
                Posteriormente conectar con BD/API
            ================================================== */}

            <div className="grafica-placeholder">

              <p>
                Gráfica
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Comparar;