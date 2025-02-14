// ./CrearOrdenCompra.tsx
import { useState } from 'react';
import {Button, Container, Flex, FormControl, FormLabel, Input, Select, useToast, Text} from '@chakra-ui/react';
import axios from 'axios';
import { Proveedor, MateriaPrima, ItemOrdenCompra, OrdenCompra } from './types';
import EndPointsURL from '../../api/EndPointsURL';
import ProveedorPicker from './components/ProveedorPicker.tsx';
import ProveedorCard from './components/ProveedorCard.tsx';
import MateriaPrimaPicker from './components/MateriaPrimaPicker.tsx';
import ListaOrdenCompraItems from './components/ListaOrdenCompraItems.tsx';
import MyDatePicker from "../../components/MyDatePicker.tsx";
import {format, addDays} from "date-fns";

const endPoints = new EndPointsURL();

export default function CrearOrdenCompra() {
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);
    const [isMateriaPrimaPickerOpen, setIsMateriaPrimaPickerOpen] = useState(false);
    const [listaItemsOrdenCompra, setListaItemsOrdenCompra] = useState<ItemOrdenCompra[]>([]);
    const toast = useToast();

    const [plazoPago, setPlazoPago] = useState(30);
    const [condicionPago, setCondicionPago] = useState("0");
    const [tiempoEntrega, setTiempoEntrega] = useState("15");
    const [fechaVencimiento, setFechaVencimiento] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"));

    const [subTotal, setSubTotal] = useState(0);
    const [iva19, setIva19] = useState(0);
    const [totalPagar, setTotalPagar] = useState(0);

    const updateTotalesAndGetValues = () => {
        const calculatedSubTotal = listaItemsOrdenCompra.reduce(
            (sum, item) => sum + item.subTotal,
            0
        );
        const calculatedIva = Math.round(
            listaItemsOrdenCompra.reduce((sum, item) => sum + item.subTotal * 0.19, 0)
        );
        const calculatedTotal = calculatedSubTotal + calculatedIva;
        setSubTotal(calculatedSubTotal);
        setIva19(calculatedIva);
        setTotalPagar(calculatedTotal);
        return { calculatedSubTotal, calculatedIva, calculatedTotal };
    };

    const clearAll = () =>{
        setSelectedProveedor(null);
        setListaItemsOrdenCompra([]);
        updateTotalesAndGetValues();
    };

    // When a MateriaPrima is selected from the picker, create an ItemOrdenCompra with default numeric values.
    const handleAddMateriaPrima = (materia: MateriaPrima) => {
        const newItem: ItemOrdenCompra = {
            materiaPrima: materia,
            cantidad: 0,
            precioUnitario: materia.costo,
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
        item.iva19 = Math.round(item.subTotal * 0.19);
        newList[index] = item;
        setListaItemsOrdenCompra(newList);
        updateTotalesAndGetValues();
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

        // Calculate totals and get the latest values:
        const { calculatedSubTotal, calculatedIva, calculatedTotal } = updateTotalesAndGetValues();

        const nuevaOrdenCompra: OrdenCompra = {
            proveedor: selectedProveedor,
            fechaVencimiento: fechaVencimiento + "T00:00:00",
            itemsOrdenCompra: listaItemsOrdenCompra,
            subTotal: calculatedSubTotal,      // Use the freshly computed values
            iva19: calculatedIva,
            totalPagar: calculatedTotal,
            condicionPago: condicionPago,
            tiempoEntrega: tiempoEntrega,
            plazoPago: plazoPago,
            estado: 0, // 0 = pendiente aprobación proveedor
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
            clearAll();
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


                <Flex direction={"column"} mt={"1em"} w="full" h="full" gap={"2"} p={"1em"}>

                    <Flex direction={"row"} gap={"2"} >

                        <FormControl>
                            <FormLabel> Condicion de Pago</FormLabel>
                            <Select
                                value={condicionPago}
                                onChange={(e) => {
                                    setCondicionPago(e.target.value)
                                    if(e.target.value == "1") setPlazoPago(0);
                                    }
                                }
                                ml={4}
                                width="200px"
                            >
                                <option value="0">Credito</option>
                                <option value="1">Contado</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired={condicionPago == "0"} isDisabled={condicionPago == "1"}>
                            <FormLabel>Plazo de pago (dias)</FormLabel>
                            <Input
                                value={plazoPago}
                                onChange={ (e) => {setPlazoPago(Number(e.target.value))} }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Tiempo de entrega (dias)</FormLabel>
                            <Input
                                value={tiempoEntrega}
                                onChange={ (e) => {setTiempoEntrega(e.target.value)} }
                            />
                        </FormControl>

                        <MyDatePicker
                            date = {fechaVencimiento}
                            setDate = {setFechaVencimiento}
                            defaultDate = {format(new Date(), "yyyy-MM-dd")}
                            label = {"Fecha de Vencimiento Orden"}
                        />

                    </Flex>

                </Flex>
                <Text hidden={true}> Sub Total: {subTotal} - iva19: {iva19} - Total a Pagar: {totalPagar} </Text>
                <Button onClick={() => setIsMateriaPrimaPickerOpen(true)}>
                    Agregar Materia Prima
                </Button>

                <ListaOrdenCompraItems
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
                onSelectMateriaPrima={ (materia: MateriaPrima) => {
                    handleAddMateriaPrima(materia);
                    }
                }
            />
        </Container>
    );
}
