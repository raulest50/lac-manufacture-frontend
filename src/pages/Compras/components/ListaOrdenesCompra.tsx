// src/components/ListaOrdenesCompra.tsx
import React, { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    useOutsideClick
} from '@chakra-ui/react';
import {getEstadoText, OrdenCompraMateriales} from '../types';
import OrdenCompraDetails from './OrdenCompraDetails';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';
import { useAuth } from '../../../context/AuthContext';

import CancelarOrdenDialog from './CancelarOrdenDialog';
import ActualizarEstadoOrdenCompraDialog from "./ActualizarEstadoOrdenCompraDialog.tsx";
// import {ExcelOCGenerator} from "../ExcelOCGenerator.tsx";
import PdfGenerator from "../pdfGenerator.tsx";

interface ListaOrdenesCompraProps {
    ordenes: OrdenCompraMateriales[];
    onClose4Dialogs: (page:number) => void;
    page: number;
}

interface ContextMenuState {
    mouseX: number;
    mouseY: number;
    orden: OrdenCompraMateriales;
}

// Interfaz para las autoridades del usuario
interface Authority {
    authority: string;
    nivel: string;
}

// Interfaz para la respuesta del endpoint whoami
interface WhoAmIResponse {
    principal: {
        authorities: Authority[];
    };
    authorities: Authority[];
}

const ListaOrdenesCompra: React.FC<ListaOrdenesCompraProps> = ({ ordenes, onClose4Dialogs, page}) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [selectedOrden, setSelectedOrden] = useState<OrdenCompraMateriales | null>(null);
    const [ordenToCancel, setOrdenToCancel] = useState<OrdenCompraMateriales | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const [actualizarDialogOpen, setActualizarDialogOpen] = useState(false);
    const [ordenToActualizar, setOrdenToActualizar] = useState<OrdenCompraMateriales | null>(null);

    // Estado para almacenar el nivel de acceso del usuario para el módulo COMPRAS
    const [comprasAccessLevel, setComprasAccessLevel] = useState<number>(0);

    // Obtener información del usuario autenticado
    const { user } = useAuth();
    const endPoints = new EndPointsURL();

    // Obtener el nivel de acceso del usuario al cargar el componente
    useEffect(() => {
        const fetchUserAccessLevel = async () => {
            try {
                const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
                const authorities = response.data.authorities;

                // Buscar la autoridad para el módulo COMPRAS
                const comprasAuthority = authorities.find(
                    auth => auth.authority === "ACCESO_COMPRAS"
                );

                // Si se encuentra, establecer el nivel de acceso
                if (comprasAuthority) {
                    setComprasAccessLevel(parseInt(comprasAuthority.nivel));
                }
            } catch (error) {
                console.error("Error al obtener el nivel de acceso:", error);
            }
        };

        fetchUserAccessLevel();
    }, []);

    const contextMenuRef = React.useRef<HTMLDivElement>(null);
    useOutsideClick({
        ref: contextMenuRef,
        handler: () => setContextMenu(null),
    });

    const handleContextMenu = (event: React.MouseEvent, orden: OrdenCompraMateriales) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            orden: orden,
        });
    };

    const handleGenerarExcel = async () => {
        if (contextMenu) {
            // const generator = new ExcelOCGenerator();
            // await generator.downloadExcel(contextMenu.orden as OrdenCompra);
            const generator = new PdfGenerator();
            await generator.downloadPDF_OCM(contextMenu.orden as OrdenCompraMateriales);
        }
        setContextMenu(null);
    };

    const handleVerMas = () => {
        if (contextMenu) {
            setSelectedOrden(contextMenu.orden);
        }
        setContextMenu(null);
    };

    const handleCancelarOrden = () => {
        if (contextMenu) {
            setOrdenToCancel(contextMenu.orden);
            setCancelDialogOpen(true);
        }
        setContextMenu(null);
    };

    const handleActualizarOrden = () => {
        if (contextMenu) {
            setOrdenToActualizar(contextMenu.orden);
            setActualizarDialogOpen(true);
        }
        setContextMenu(null);
    };

    return (
        <>
            <Box overflowX="auto" mt={4}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Fecha Emisión</Th>
                            <Th>Fecha Vencimiento</Th>
                            <Th>Proveedor</Th>
                            <Th>Total a Pagar</Th>
                            <Th>Estado</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {ordenes.map((orden) => (
                            <Tr
                                key={orden.ordenCompraId}
                                onContextMenu={(e) => handleContextMenu(e, orden)}
                                _hover={{ bg: 'blue.100', cursor: 'pointer' }}
                            >
                                <Td>{orden.ordenCompraId}</Td>
                                <Td>
                                    {orden.fechaEmision
                                        ? new Date(orden.fechaEmision).toLocaleString()
                                        : '-'}
                                </Td>
                                <Td>
                                    {orden.fechaVencimiento
                                        ? new Date(orden.fechaVencimiento).toLocaleDateString()
                                        : '-'}
                                </Td>
                                <Td>{orden.proveedor ? orden.proveedor.nombre : '-'}</Td>
                                <Td>{orden.totalPagar}</Td>
                                <Td>{getEstadoText(orden.estado)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Custom Context Menu */}
            {contextMenu && (
                <Box
                    ref={contextMenuRef}
                    position="fixed"
                    top={contextMenu.mouseY}
                    left={contextMenu.mouseX}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="md"
                    zIndex={1000}
                    p={2}
                >
                    {/* Solo mostrar la opción de generar PDF si la orden está liberada (estado > 0) */}
                    {contextMenu.orden.estado > 0 && (
                        <Box
                            p={1}
                            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                            onClick={handleGenerarExcel}
                        >
                            Generar PDF
                        </Box>
                    )}
                    <Box
                        p={1}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={handleVerMas}
                    >
                        Ver más
                    </Box>
                    {/* Solo mostrar la opción de cancelar orden si el usuario es master o tiene nivel de acceso 2 o superior */}
                    {(user === 'master' || comprasAccessLevel >= 2) && (
                        <Box
                            p={1}
                            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                            onClick={handleCancelarOrden}
                        >
                            Cancelar Orden
                        </Box>
                    )}
                    {/* Solo mostrar la opción de actualizar estado si el usuario es master o tiene nivel de acceso 2 o superior */}
                    {(user === 'master' || comprasAccessLevel >= 2) && (
                        <Box
                            p={1}
                            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                            onClick={handleActualizarOrden}
                        >
                            Actualizar Estado de la Orden
                        </Box>
                    )}
                </Box>
            )}

            {/* Modal Dialog with Order Details */}
            {selectedOrden && (
                <OrdenCompraDetails
                    isOpen={!!selectedOrden}
                    onClose={() => setSelectedOrden(null)}
                    orden={selectedOrden}
                />
            )}

            {/* Cancel Order Dialog */}
            {ordenToCancel && (
                <CancelarOrdenDialog
                    isOpen={cancelDialogOpen}
                    onClose={() => {
                        setCancelDialogOpen(false);
                        setOrdenToCancel(null);
                        onClose4Dialogs(page);
                    }}
                    orden={ordenToCancel}
                    onOrderCancelled={() => {
                        // Optionally refresh the list or update UI state here.
                    }}
                />
            )}

            {/* Modal Dialog to some OrdenCompra states */}
            {ordenToActualizar && (
                <ActualizarEstadoOrdenCompraDialog
                    isOpen={actualizarDialogOpen}
                    onClose={() => {
                        setActualizarDialogOpen(false);
                        setOrdenToActualizar(null);
                        onClose4Dialogs(page);
                    }}
                    orden={ordenToActualizar}
                    onEstadoUpdated={() => {
                        // Optionally refresh the order list here.
                    }}
                />
            )}
        </>
    );
};

export default ListaOrdenesCompra;
