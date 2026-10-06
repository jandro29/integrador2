import { useEffect, useState } from "react";
import "./procesoDetalle.css";

interface Proceso {
  [key: string]: any;
}

function ProcesoDetalle() {

  const [proceso, setProceso] = useState<Proceso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const campo = params.get("campo");

  useEffect(() => {

    const obtenerDetalle = async () => {

      if (!codigo || !campo) {
        setError("No se recibió el código del proceso.");
        setCargando(false);
        return;
      }

      try {

        const url =
          `http://localhost:3000/api/procesos/detalle` +
          `?campo=${encodeURIComponent(campo)}` +
          `&codigo=${encodeURIComponent(codigo)}`;

        console.log("Consultando:", url);

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
          throw new Error(
            respuesta.status === 404
              ? "No se encontró el proceso."
              : "Error al obtener el detalle."
          );
        }

        const datos = await respuesta.json();
        console.log("Detalle recibido:", datos);

        setProceso(datos);

      } catch (err: any) {

        console.error(err);
        setError(err.message || "No se pudo cargar el detalle.");

      } finally {

        setCargando(false);

      }

    };

    obtenerDetalle();

  }, [codigo, campo]);


  // "codigo_proceso" -> "Codigo proceso"
  const formatearEtiqueta = (clave: string) => {
    const texto = clave.replace(/_/g, " ").trim();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const formatearValor = (clave: string, valor: any) => {

    if (valor === null || valor === undefined || valor === "") {
      return "No disponible";
    }

    const k = clave.toLowerCase();

    if (k.includes("monto") || k.includes("valor_ref")) {
      const numero = Number(valor);
      if (!isNaN(numero)) {
        return new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: "PEN"
        }).format(numero);
      }
    }

    if (k.includes("fecha")) {
      const fecha = new Date(valor);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString("es-PE");
      }
    }

    // Si viniera un objeto, se convierte a texto para que React no falle
    if (typeof valor === "object") {
      return JSON.stringify(valor);
    }

    return String(valor);

  };

  const buscar = (campos: string[]) => {
    if (!proceso) return "";
    for (const c of campos) {
      if (proceso[c] !== undefined && proceso[c] !== null && proceso[c] !== "") {
        return proceso[c];
      }
    }
    return "";
  };


  return (
    <div className="detalle-page">
      <main className="detalle-contenido">

        <a href="/procesos" className="detalle-volver">
          ← Volver a procesos
        </a>

        {cargando && <p className="detalle-mensaje">Cargando detalle...</p>}

        {!cargando && error && <p className="detalle-mensaje">{error}</p>}

        {!cargando && !error && proceso && (
          <>
            {/* RESUMEN */}
            <section className="detalle-resumen">
              <div>
                <span className="detalle-codigo">
                  {String(codigo)}
                </span>
                <h1>
                  {String(
                    buscar([
                      "descripcion",
                      "descripcion_proceso",
                      "objeto_contratacion",
                      "objeto"
                    ]) || "Detalle del proceso"
                  )}
                </h1>
                <p>
                  {String(
                    buscar(["entidad", "nombre_entidad", "entidad_nombre"]) ||
                      "Entidad no disponible"
                  )}
                </p>
              </div>

              <div className="detalle-monto">
                <span>Monto referencial</span>
                <strong>
                  {formatearValor(
                    "monto",
                    buscar([
                      "monto_referencial",
                      "monto_referencia",
                      "valor_referencial"
                    ])
                  )}
                </strong>
                <em className="detalle-estado">
                  {String(
                    buscar(["estado", "estado_proceso", "estado_convocatoria"]) ||
                      "Sin estado"
                  )}
                </em>
              </div>
            </section>

            {/* TODOS LOS CAMPOS */}
            <section className="detalle-card">
              <h2>Información completa</h2>

              <div className="detalle-grid">
                {Object.entries(proceso).map(([clave, valor]) => (
                  <div className="detalle-item" key={clave}>
                    <span>{formatearEtiqueta(clave)}</span>
                    <strong>{formatearValor(clave, valor)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}

export default ProcesoDetalle;