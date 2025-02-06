// src/components/ListaOrdenesCompra.tsx
import React, { useState } from 'react';
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
import {getEstadoText, OrdenCompra} from '../types';
import OrdenCompraDetails from './OrdenCompraDetails';
import PdfGenerator from "../pdfGenerator";
import CancelarOrdenDialog from './CancelarOrdenDialog';

interface ListaOrdenesCompraProps {
    ordenes: OrdenCompra[];
}

interface ContextMenuState {
    mouseX: number;
    mouseY: number;
    orden: OrdenCompra;
}

const ListaOrdenesCompra: React.FC<ListaOrdenesCompraProps> = ({ ordenes }) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null);
    const [ordenToCancel, setOrdenToCancel] = useState<OrdenCompra | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const contextMenuRef = React.useRef<HTMLDivElement>(null);
    useOutsideClick({
        ref: contextMenuRef,
        handler: () => setContextMenu(null),
    });

    const handleContextMenu = (event: React.MouseEvent, orden: OrdenCompra) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            orden: orden,
        });
    };

    const handleGenerarPDF = () => {
        if (contextMenu) {
            new PdfGenerator(contextMenu.orden);
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
        // Implement update logic as needed.
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
                    <Box
                        p={1}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={handleGenerarPDF}
                    >
                        Generar PDF
                    </Box>
                    <Box
                        p={1}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={handleVerMas}
                    >
                        Ver más
                    </Box>
                    <Box
                        p={1}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={handleCancelarOrden}
                    >
                        Cancelar Orden
                    </Box>
                    <Box
                        p={1}
                        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                        onClick={handleActualizarOrden}
                    >
                        Actualizar Estado de la Orden
                    </Box>
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
                    }}
                    orden={ordenToCancel}
                    onOrderCancelled={() => {
                        // Optionally refresh the list or update UI state here.
                    }}
                />
            )}
        </>
    );
};

export default ListaOrdenesCompra;
