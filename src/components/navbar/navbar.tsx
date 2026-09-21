import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* ==================================================
          LOGO
      ================================================== */}
      <NavLink
        to="/"
        className="navbar-logo"
      >
        <span className="logo-icon">
          🏛️
        </span>

        <span>
          Sistema de Obras Públicas del Perú
        </span>
      </NavLink>


      {/* ==================================================
          MENÚ DE NAVEGACIÓN
      ================================================== */}
      <div className="navbar-links">

        {/* INICIO */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "navbar-link activo"
              : "navbar-link"
          }
        >
          Inicio
        </NavLink>


        {/* PROCESOS */}
        <NavLink
          to="/procesos"
          end
          className={({ isActive }) =>
            isActive
              ? "navbar-link activo"
              : "navbar-link"
          }
        >
          Procesos
        </NavLink>


        {/* PROCESOS DETALLE */}
        <NavLink
          to="/procesoDetalle"
          className={({ isActive }) =>
            isActive
              ? "navbar-link activo"
              : "navbar-link"
          }
        >
          Procesos Detalle
        </NavLink>


        {/* COMPARAR */}
        <NavLink
          to="/comparar"
          className={({ isActive }) =>
            isActive
              ? "navbar-link activo"
              : "navbar-link"
          }
        >
          Comparar
        </NavLink>

      </div>


      {/* ==================================================
          ADMINISTRACIÓN
      ================================================== */}
      <div className="navbar-admin">

        <span className="admin-icon">
          ⚙️
        </span>

        <span>
          Administración
        </span>

      </div>

    </nav>
  );
}

export default Navbar;