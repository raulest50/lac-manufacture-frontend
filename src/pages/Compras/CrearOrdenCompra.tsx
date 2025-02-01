// ./CrearOrdenCompra.tsx
import { useState } from 'react';
import { Button, Container, Flex, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Proveedor, MateriaPrima, ItemOrdenCompra, OrdenCompra } from './types';
import EndPointsURL from '../../api/EndPointsURL';
import ProveedorPicker from './components/ProveedorPicker.tsx';
import ProveedorCard from './components/ProveedorCard.tsx';
import MateriaPrimaPicker from './components/MateriaPrimaPicker.tsx';
import OrdenCompraItems from './components/OrdenCompraItems.tsx';

const endPoints = new EndPointsURL();

export default function CrearOrdenCompra() {
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);
    const [isMateriaPrimaPickerOpen, setIsMateriaPrimaPickerOpen] = useState(false);
    const [listaItemsOrdenCompra, setListaItemsOrdenCompra] = useState<ItemOrdenCompra[]>([]);
    const toast = useToast();

    // When a MateriaPrima is selected from the picker, create an ItemOrdenCompra with default numeric values.
    const handleAddMateriaPrima = (materia: MateriaPrima) => {
        const newItem: ItemOrdenCompra = {
            materiaPrima: materia,
            cantidad: 0,
            precioUnitario: 0,
            iva19: 0,
            subTotal: 0,
            cantidadCorrecta: 0,
            precioCorrecto: 0,
        };
        setListaItemsOrdenCompra([...listaItemsOrdenCompra, newItem]);
    };

    const handleRemoveItem = (index: number) => {
        const newList = listaItemsOrdenCompra.filter((_, i) => i !== index);
        setListaItemsOrdenCompra(newList);
    };

    const handleUpdateItem = (
        index: number,
        field: 'cantidad' | 'precioUnitario',
        value: number
    ) => {
        const newList = [...listaItemsOrdenCompra];
        const item = newList[index];
        if (field === 'cantidad') {
            item.cantidad = value;
        } else if (field === 'precioUnitario') {
            item.precioUnitario = value;
        }
        // Recalculate subTotal = cantidad * precioUnitario
        item.subTotal = item.cantidad * item.precioUnitario;
        newList[index] = item;
        setListaItemsOrdenCompra(newList);
    };

    // Called when the user clicks "Crear Orden de Compra"
    const crearOrdenCompraOnClick = async () => {
        if (!selectedProveedor) {
            toast({
                title: 'Proveedor no seleccionado',
                description: 'Por favor, seleccione un proveedor.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        if (listaItemsOrdenCompra.length === 0) {
            toast({
                title: 'No hay items',
                description: 'Agregue al menos un item a la orden de compra.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Calculate subTotal, IVA (19%), and totalPagar
        const subTotal = listaItemsOrdenCompra.reduce((sum, item) => sum + item.subTotal, 0);
        const iva19 = Math.round(
            listaItemsOrdenCompra.reduce((sum, item) => sum + item.subTotal * 0.19, 0)
        );
        const totalPagar = subTotal + iva19;

        const nuevaOrdenCompra: OrdenCompra = {
            proveedor: selectedProveedor,
            itemOrdenCompra: listaItemsOrdenCompra,
            subTotal: subTotal,
            iva19: iva19,
            totalPagar: totalPagar,
            condicionPago: '',    // Adjust as needed
            tiempoEntrega: '',
            plazo_pago: 0,
            estado: 0,            // 0 = pendiente aprobación proveedor
        };

        try {
            // Explicitly set the header to ensure JSON is sent.
            const response = await axios.post(
                endPoints.save_orden_compra,
                nuevaOrdenCompra,
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log(response.data);
            toast({
                title: 'Orden de compra creada',
                description: 'La orden de compra ha sido creada exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Optionally, clear the form:
            // setSelectedProveedor(null);
            // setListaItemsOrdenCompra([]);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error al crear la orden',
                description: 'Hubo un error al crear la orden de compra.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <Flex direction="column" p={0} m={0} w="full" h="full">
                <ProveedorCard
                    selectedProveedor={selectedProveedor}
                    onSearchClick={() => setIsProveedorPickerOpen(true)}
                />

                <Button onClick={() => setIsMateriaPrimaPickerOpen(true)}>
                    Agregar Materia Prima
                </Button>

                <OrdenCompraItems
                    items={listaItemsOrdenCompra}
                    onRemoveItem={handleRemoveItem}
                    onUpdateItem={handleUpdateItem}
                />

                <Button colorScheme="teal" onClick={crearOrdenCompraOnClick}>
                    Crear Orden de Compra
                </Button>
            </Flex>

            {/* ProveedorPicker Modal */}
            <ProveedorPicker
                isOpen={isProveedorPickerOpen}
                onClose={() => setIsProveedorPickerOpen(false)}
                onSelectProveedor={(proveedor) => setSelectedProveedor(proveedor)}
            />

            {/* MateriaPrimaPicker Modal */}
            <MateriaPrimaPicker
                isOpen={isMateriaPrimaPickerOpen}
                onClose={() => setIsMateriaPrimaPickerOpen(false)}
                onSelectMateriaPrima={handleAddMateriaPrima}
            />
        </Container>
    );
}
