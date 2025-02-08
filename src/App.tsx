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
import LoginPanel from "./pages/LoginPage/LoginPanel.tsx";
import InformesPage from "./pages/Informes/InformesPage.tsx";
import RecibirMercanciaPage from "./pages/RecibirMercancia/RecibirMercanciaPage.tsx";
import UsuariosPage from "./pages/Usuarios/UsuariosPage.tsx";
import MultiRoleProtectedRoute from "./components/MultiRoleProtectedRoute.tsx";

const role_master = "ROLE_MASTER";
const role_compras = "ROLE_COMPRAS";
const role_jefe_prod = "ROLE_JEFE_PRODUCCION";
const role_asist_prod = "ROLE_ASISTENTE PRODUCCION";
const role_almacen = "ROLE_ALMACEN";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public login route (outside RootLayout if you like) */}
            <Route path="/login" element={<LoginPanel />} />

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
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_asist_prod]}>
                            <Responsable_1/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="responsable_2"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_asist_prod]}>
                            <Responsable_2/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="recepcion_mprima"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_almacen]}>
                            <RecibirMercanciaPage/>
                        </MultiRoleProtectedRoute>
                    }
                />

                {/* Master routes */}
                <Route
                    path="producto"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master]}>
                            <ProductosPage/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="produccion"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_jefe_prod]}>
                            <ProduccionPage/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="stock"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_jefe_prod, role_compras]}>
                            <StockPage/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="proveedores"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_compras]}>
                            <ProveedoresPage/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="compras"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_compras]}>
                            <ComprasPage/>
                        </MultiRoleProtectedRoute>
                    }
                />
                <Route
                    path="informes"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_jefe_prod, role_compras]}>
                            <InformesPage/>
                        </MultiRoleProtectedRoute>
                    }
                />

                <Route
                    path="usuarios"
                    element={
                        <ProtectedRoute requiredRole={role_master}>
                            <UsuariosPage/>
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
