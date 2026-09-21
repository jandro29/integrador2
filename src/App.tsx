import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/inicio/inicio"
import Procesos from "./pages/procesos/procesos"
import ProcesoDetalle from "./pages/procesoDetalle/procesoDetalle"
import Comparar from "./pages/comprar/comparar"

import Navbar from "./components/navbar/navbar";

import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

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
    </BrowserRouter>
  );
}

export default App;