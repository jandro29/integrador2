import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/inicio/inicio";
import Procesos from "./pages/procesos/procesos";
import ProcesoDetalle from "./pages/procesoDetalle/procesoDetalle";
import Comparar from "./pages/comparar/comparar";

import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/procesos" element={<Procesos />} />
        <Route path="/procesoDetalle" element={<ProcesoDetalle />} />
        <Route path="/comparar" element={<Comparar />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;