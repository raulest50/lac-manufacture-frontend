//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'

import RootLayout from "./pages/RootLayout.tsx";
import Home from "./pages/Home.tsx"
import CrearProducto from './pages/Producto/CrearProducto.tsx'
import Seguimiento from "./pages/Seguimiento.tsx";
import Produccion from "./pages/Produccion.tsx";

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<RootLayout/>}>
      <Route index element={<Home/>} />
      <Route path={"/producto"} element={<CrearProducto/>} />
      <Route path={"/produccion"} element={<Produccion/>} />
      <Route path={"/seguimiento"} element={<Seguimiento/>} />
      <Route path={"/picking"} element={<CrearProducto/>} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
