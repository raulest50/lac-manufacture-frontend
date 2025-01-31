//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'

import RootLayout from "./pages/RootLayout.tsx";
import Home from "./pages/Home.tsx"
import ProductosPage from './pages/Productos/ProductosPage.tsx'
import StockPage from "./pages/Stock/StockPage.tsx";
import ProduccionPage from "./pages/Produccion/ProduccionPage.tsx";

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import Responsable_1 from "./pages/Operarios/Responsable_1.tsx";
import Responsable_2 from "./pages/Operarios/Responsable_2.tsx";

import ProveedoresPage from "./pages/Proveedores/ProveedoresPage.tsx";
import ComprasPage from "./pages/Compras/ComprasPage.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import InformesPage from "./pages/Informes/InformesPage.tsx";
import RecibirMercanciaPage from "./pages/RecibirMercancia/RecibirMercanciaPage.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public login route (outside RootLayout if you like) */}
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<RootLayout />}>
                {/* Home is protected => if not logged in => go to /login */}
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                {/* Worker routes */}
                <Route
                    path="responsable_1"
                    element={
                        <ProtectedRoute requiredRole="ROLE_WORKER">
                            <Responsable_1/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="responsable_2"
                    element={
                        <ProtectedRoute requiredRole="ROLE_WORKER">
                            <Responsable_2/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="recepcion_mprima"
                    element={
                        <ProtectedRoute requiredRole="ROLE_WORKER">
                            <RecibirMercanciaPage/>
                        </ProtectedRoute>
                    }
                />

                {/* Master routes */}
                <Route
                    path="producto"
                    element={
                        <ProtectedRoute requiredRole="ROLE_MASTER">
                            <ProductosPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="produccion"
                    element={
                        <ProtectedRoute requiredRole="ROLE_MASTER">
                            <ProduccionPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="stock"
                    element={
                        <ProtectedRoute requiredRole="ROLE_MASTER">
                            <StockPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="proveedores"
                    element={
                        <ProtectedRoute requiredRole="ROLE_MASTER">
                            <ProveedoresPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="compras"
                    element={
                        <ProtectedRoute requiredRole="ROLE_MASTER">
                            <ComprasPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="informes"
                    element={
                        <ProtectedRoute requiredRole="ROLE_MASTER">
                            <InformesPage/>
                        </ProtectedRoute>
                    }
                />


            </Route>
        </>
    )
)

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App
