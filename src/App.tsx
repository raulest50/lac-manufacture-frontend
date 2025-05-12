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

import ProveedoresPage from "./pages/Proveedores/ProveedoresPage.tsx";
import ComprasPage from "./pages/Compras/ComprasPage.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import LoginPanel from "./pages/LoginPage/LoginPanel.tsx";
import InformesPage from "./pages/Informes/InformesPage.tsx";
import RecibirMercanciaPage from "./pages/RecibirMercancia/RecibirMercanciaPage.tsx";
import UsuariosPage from "./pages/Usuarios/UsuariosPage.tsx";
import MultiRoleProtectedRoute from "./components/MultiRoleProtectedRoute.tsx";

import {role_master, role_jefe_prod, role_compras, role_asist_prod, role_almacen} from "./pages/Usuarios/types.tsx";
import CargaMasivaPage from "./pages/CargaMasiva/CargaMasivaPage.tsx";
import ActivosPage from "./pages/activos/ActivosPage.tsx";
import ContabilidadPage from "./pages/contabilidad/ContabilidadPage.tsx";
import PersonalPage from "./pages/personal/PersonalPage.tsx";
import BintelligencePage from "./pages/bintelligence/BintelligencePage.tsx";

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
                    path="asistente_produccion"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_asist_prod]}>
                            <Responsable_1/>
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

                <Route
                    path="carga_masiva"
                    element={
                        <ProtectedRoute requiredRole={role_master}>
                            <CargaMasivaPage/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="activos"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_almacen]}>
                            <ActivosPage/>
                        </MultiRoleProtectedRoute>
                    }
                />

                <Route
                    path="contabilidad"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_almacen]}>
                            <ContabilidadPage/>
                        </MultiRoleProtectedRoute>
                    }
                />

                <Route
                    path="personal"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_almacen]}>
                            <PersonalPage/>
                        </MultiRoleProtectedRoute>
                    }
                />

                <Route
                    path="bintelligence"
                    element={
                        <MultiRoleProtectedRoute supportedRoles={[role_master, role_almacen]}>
                            <BintelligencePage/>
                        </MultiRoleProtectedRoute>
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
