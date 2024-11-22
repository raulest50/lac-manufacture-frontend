//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'

import RootLayout from "./pages/RootLayout.tsx";
import Home from "./pages/Home.tsx"
import CrearProducto from './pages/Producto/CrearProducto.tsx'
import StockPage from "./pages/Stock/StockPage.tsx";
import Produccion from "./pages/Produccion/Produccion.tsx";

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import Responsable_1 from "./pages/Responsable_1.tsx";
import Responsable_2 from "./pages/Responsable_2.tsx";

import ProveedoresPage from "./pages/Proveedores.tsx";
import ComprasMain from "./pages/Compras/ComprasMain.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<RootLayout/>}>
      <Route index element={<Home/>} />
      <Route path={"/producto"} element={<CrearProducto/>} />
      <Route path={"/produccion"} element={<Produccion/>} />
      <Route path={"/stock"} element={<StockPage/>} />
      <Route path={"/responsable_1"} element={<Responsable_1/>} />
      <Route path={"/responsable_2"} element={<Responsable_2/>} />
      <Route path={"/proveedores"} element={<ProveedoresPage/>} />
      <Route path={"/compras"} element={<ComprasMain/>} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
