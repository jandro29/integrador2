import { useEffect, useState } from "react";
import "./procesos.css";

interface Proceso {
  [key: string]: any;
}

// Nombres posibles de cada campo (se usa el primero que tenga valor)
const CAMPOS_CODIGO = ["codigo_proceso", "codigo", "nro_proceso", "numero_proceso"];
const CAMPOS_ENTIDAD = ["entidad", "nombre_entidad", "entidad_nombre"];
const CAMPOS_ESTADO = ["estado", "estado_proceso", "estado_convocatoria"];
const CAMPOS_FECHA = ["fecha_convocatoria", "fecha", "fecha_proceso"];
const CAMPOS_DESCRIPCION = ["descripcion", "descripcion_proceso", "objeto_contratacion", "objeto"];
const CAMPOS_MONTO = ["monto_referencial", "monto_referencia", "valor_referencial"];

function Procesos() {

  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [procesosFiltrados, setProcesosFiltrados] = useState<Proceso[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [buscar, setBuscar] = useState("");
  const [entidad, setEntidad] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");


  // =====================================================
  // OBTENER PROCESOS DESDE EL BACKEND
  // =====================================================

  useEffect(() => {

    const obtenerProcesos = async () => {

      try {

        setCargando(true);
        setError("");

        const respuesta = await fetch("http://localhost:3000/api/procesos");

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los procesos");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error("La respuesta del servidor no es válida");
        }

        setProcesos(datos);
        setProcesosFiltrados(datos);

      } catch (error) {

        console.error("Error al obtener procesos:", error);
        setError("No se pudieron cargar los procesos desde la base de datos.");

      } finally {

        setCargando(false);

      }

    };

    obtenerProcesos();

  }, []);


  // =====================================================
  // OBTENER VALOR DE UN CAMPO
  // =====================================================

  const obtenerValor = (proceso: Proceso, campos: string[]) => {

    for (const campo of campos) {
      if (
        proceso[campo] !== undefined &&
        proceso[campo] !== null &&
        proceso[campo] !== ""
      ) {
        return proceso[campo];
      }
    }

    return "";

  };


  // =====================================================
  // FILTRAR PROCESOS
  // =====================================================

  const aplicarFiltros = () => {

    let resultados = [...procesos];

    if (buscar.trim() !== "") {
      const texto = buscar.trim().toLowerCase();

      resultados = resultados.filter((proceso) =>
        JSON.stringify(proceso).toLowerCase().includes(texto)
      );
    }

    if (entidad !== "") {
      resultados = resultados.filter((proceso) =>
        String(obtenerValor(proceso, CAMPOS_ENTIDAD))
          .toLowerCase()
          .includes(entidad.toLowerCase())
      );
    }

    if (estado !== "") {
      resultados = resultados.filter((proceso) =>
        String(obtenerValor(proceso, CAMPOS_ESTADO))
          .toLowerCase()
          .includes(estado.toLowerCase())
      );
    }

    if (fecha !== "") {
      resultados = resultados.filter((proceso) =>
        String(obtenerValor(proceso, CAMPOS_FECHA)).includes(fecha)
      );
    }

    setProcesosFiltrados(resultados);

  };


  // =====================================================
  // LIMPIAR FILTROS
  // =====================================================

  const limpiarFiltros = () => {

    setBuscar("");
    setEntidad("");
    setEstado("");
    setFecha("");

    setProcesosFiltrados(procesos);

  };


  // =====================================================
  // OBTENER EL CÓDIGO (Y LA COLUMNA DE DONDE SALE)
  // Primero prueba nombres conocidos; si no los encuentra,
  // busca una columna que parezca un código/identificador.
  // =====================================================

  const obtenerCodigoInfo = (proceso: Proceso) => {

    for (const campo of CAMPOS_CODIGO) {
      if (
        proceso[campo] !== undefined &&
        proceso[campo] !== null &&
        proceso[campo] !== ""
      ) {
        return { campo, valor: proceso[campo] };
      }
    }

    const claves = Object.keys(proceso).filter(
      (k) =>
        /cod|nro|num|^id$|_id$|^id_/i.test(k) &&
        proceso[k] !== null &&
        proceso[k] !== ""
    );

    const campo = claves.find((k) => /proceso/i.test(k)) || claves[0];

    return campo
      ? { campo, valor: proceso[campo] }
      : { campo: "", valor: "" };

  };


  // =====================================================
  // VER DETALLE DEL PROCESO
  // Envía la columna y el valor, ej:
  //   /procesoDetalle?campo=codigo_proceso&codigo=ABC-123
  // =====================================================

  const verDetalle = (procesoSeleccionado: Proceso) => {

    console.log("Columnas del proceso:", Object.keys(procesoSeleccionado));

    const { campo, valor } = obtenerCodigoInfo(procesoSeleccionado);

    if (!campo || !valor) {
      alert("Este proceso no tiene un código para consultar el detalle.");
      return;
    }

    window.location.href =
      `/procesoDetalle?campo=${encodeURIComponent(campo)}` +
      `&codigo=${encodeURIComponent(String(valor))}`;

  };


  // =====================================================
  // FORMATEAR MONEDA
  // =====================================================

  const formatearMonto = (monto: any) => {

    const numero = Number(monto);

    if (isNaN(numero)) {
      return "S/ 0.00";
    }

    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero);

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="procesos-page">

      <main className="procesos-contenido">

        {/* ENCABEZADO */}

        <section className="procesos-header">

          <div>
            <h1>Procesos de contratación</h1>
            <p>
              Consulta y filtra los procesos de contratación
              de obras públicas registrados.
            </p>
          </div>

          <div className="procesos-total">
            <span>Procesos registrados</span>
            <strong>
              {cargando
                ? "Cargando..."
                : procesos.length.toLocaleString("es-PE")}
            </strong>
          </div>

        </section>


        {/* FILTROS */}

        <section className="filtros-card">

          <div className="filtros-header">
            <h2>Buscar procesos</h2>

            <button
              type="button"
              className="limpiar-filtros"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>

          <div className="filtros">

            <div className="filtro-grupo">
              <label htmlFor="buscar">Buscar</label>
              <input
                id="buscar"
                type="text"
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                placeholder="Código, proceso, entidad o proveedor..."
              />
            </div>

            <div className="filtro-grupo">
              <label htmlFor="entidad">Entidad</label>
              <select
                id="entidad"
                value={entidad}
                onChange={(e) => setEntidad(e.target.value)}
              >
                <option value="">Todas las entidades</option>
                <option value="municipalidad">Municipalidad</option>
                <option value="gobierno regional">Gobierno Regional</option>
              </select>
            </div>

            <div className="filtro-grupo">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="convocado">Convocado</option>
                <option value="adjudicado">Adjudicado</option>
                <option value="contratado">Contratado</option>
              </select>
            </div>

            <div className="filtro-grupo">
              <label htmlFor="fecha">Fecha</label>
              <select
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              >
                <option value="">Todas las fechas</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <button
              type="button"
              className="buscar-button"
              onClick={aplicarFiltros}
            >
              Buscar
            </button>

          </div>

        </section>


        {/* TABLA */}

        <section className="tabla-card">

          <div className="tabla-header">
            <div>
              <h2>Procesos registrados</h2>
              <p>Resultados de búsqueda</p>
            </div>

            <span className="resultado-count">
              {procesosFiltrados.length.toLocaleString("es-PE")}
              {" resultados"}
            </span>
          </div>

          {cargando && (
            <div className="mensaje-tabla">
              <p>Cargando procesos desde la base de datos...</p>
            </div>
          )}

          {!cargando && error && (
            <div className="mensaje-tabla">
              <p>{error}</p>
            </div>
          )}

          {!cargando && !error && (

            <div className="tabla-container">

              <table>

                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Entidad</th>
                    <th>Objeto de contratación</th>
                    <th>Monto referencial</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>

                  {procesosFiltrados.length === 0 ? (

                    <tr>
                      <td colSpan={6} className="sin-resultados">
                        No se encontraron procesos.
                      </td>
                    </tr>

                  ) : (

                    procesosFiltrados.map((proceso, index) => {

                      const codigo = obtenerCodigoInfo(proceso).valor;
                      const nombreEntidad = obtenerValor(proceso, CAMPOS_ENTIDAD);
                      const descripcion = obtenerValor(proceso, CAMPOS_DESCRIPCION);
                      const monto = obtenerValor(proceso, CAMPOS_MONTO);
                      const estadoProceso = obtenerValor(proceso, CAMPOS_ESTADO);

                      return (

                        <tr key={codigo || index}>

                          <td>{codigo || `Proceso ${index + 1}`}</td>

                          <td>{nombreEntidad || "No disponible"}</td>

                          <td>{descripcion || "No disponible"}</td>

                          <td>{formatearMonto(monto)}</td>

                          <td>
                            <span
                              className={`estado ${String(estadoProceso)
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {estadoProceso || "No disponible"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="ver-button"
                              onClick={() => verDetalle(proceso)}
                            >
                              Ver
                            </button>
                          </td>

                        </tr>

                      );

                    })

                  )}

                </tbody>

              </table>

            </div>

          )}


          {/* PAGINACIÓN */}

          {!cargando && !error && procesosFiltrados.length > 0 && (

            <div className="paginacion">
              <button type="button" disabled>← Anterior</button>
              <span>Página 1</span>
              <button type="button" disabled>Siguiente →</button>
            </div>

          )}

        </section>

      </main>

    </div>

  );

}

export default Procesos;