//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'

import RootLayout from "./pages/RootLayout.tsx";
import Home from "./pages/Home.tsx"
import CrearProducto from './pages/Producto/CrearProducto.tsx'
import StockPage from "./pages/StockPage.tsx";
import Produccion from "./pages/Produccion.tsx";

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import BodegaZona1 from "./pages/BodegaZona1.tsx";
import EnvasadoZona2 from "./pages/EnvasadoZona2.tsx";
import MarmitasZona3 from "./pages/MarmitasZona3.tsx";

import ClientesPage from "./pages/ClientesPage.tsx";
import ProveedoresPage from "./pages/ProveedoresPages.tsx";
import VentasPage from "./pages/VentasPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<RootLayout/>}>
      <Route index element={<Home/>} />
      <Route path={"/producto"} element={<CrearProducto/>} />
      <Route path={"/produccion"} element={<Produccion/>} />
      <Route path={"/stock"} element={<StockPage/>} />
      <Route path={"/bodega_zona1"} element={<BodegaZona1/>} />
      <Route path={"/envasado_zona2"} element={<EnvasadoZona2/>} />
      <Route path={"/marmitas_zona3"} element={<MarmitasZona3/>} />
      <Route path={"/clientes"} element={<ClientesPage/>} />
      <Route path={"/proveedores"} element={<ProveedoresPage/>} />
      <Route path={"/ventas"} element={<VentasPage/>} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
