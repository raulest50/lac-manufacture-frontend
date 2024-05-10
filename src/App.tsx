//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'

import RootLayout from "./pages/RootLayout.tsx";
import Home from "./pages/home.tsx"
import Seguimiento from "./pages/seguimiento.tsx";

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<RootLayout/>}>
      <Route index element={<Home/>} />
      <Route path={"/seguimiento"} element={<Seguimiento/>} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
