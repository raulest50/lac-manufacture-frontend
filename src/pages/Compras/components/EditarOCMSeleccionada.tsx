import { useState } from 'react';
import { 
    Flex, 
    Button, 
    Heading, 
    Box, 
    Text,
    useToast,
    FormControl,
    FormLabel,
    Input,
    Select
} from '@chakra-ui/react';
import { OrdenCompraMateriales, ItemOrdenCompra, Material } from "../types.tsx";
import MateriaPrimaPicker from './MateriaPrimaPicker.tsx';
import ListaItemsOCM from './ListaItemsOCM.tsx';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL';
import MyDatePicker from "../../../components/MyDatePicker.tsx";
import { format } from "date-fns";

type Props = {
    ocm: OrdenCompraMateriales;
    onVolver: () => void;
};

export function EditarOcmSeleccionada({ ocm, onVolver }: Props) {
    const [ordenActual, setOrdenActual] = useState<OrdenCompraMateriales>({...ocm});
    const [listaItemsOrdenCompra, setListaItemsOrdenCompra] = useState<ItemOrdenCompra[]>(ocm.itemsOrdenCompra);
    const [isMateriaPrimaPickerOpen, setIsMateriaPrimaPickerOpen] = useState(false);
    const [ivaEnabled, setIvaEnabled] = useState(true);

    // Nuevos estados para los campos adicionales
    const [condicionPago, setCondicionPago] = useState(ocm.condicionPago || "0");
    const [plazoPago, setPlazoPago] = useState(ocm.plazoPago || 30);
    const [tiempoEntrega, setTiempoEntrega] = useState(ocm.tiempoEntrega || "15");
    const [fechaVencimiento, setFechaVencimiento] = useState(
        ocm.fechaVencimiento 
            ? format(new Date(ocm.fechaVencimiento), "yyyy-MM-dd") 
            : format(new Date(), "yyyy-MM-dd")
    );

    const toast = useToast();
    const endPoints = new EndPointsURL();

    // Función para actualizar los totales
    const updateTotalesAndGetValues = () => {
        const calculatedSubTotal = listaItemsOrdenCompra.reduce(
            (sum, item) => sum + item.subTotal,
            0
        );
        const calculatedIva = Math.round(
            listaItemsOrdenCompra.reduce((sum, item) => sum + item.ivaCOP, 0)
        );
        const calculatedTotal = calculatedSubTotal + calculatedIva;

        setOrdenActual(prev => ({
            ...prev,
            subTotal: calculatedSubTotal,
            ivaCOP: calculatedIva,
            totalPagar: calculatedTotal,
            itemsOrdenCompra: listaItemsOrdenCompra,
            // Actualizar los campos adicionales
            condicionPago: condicionPago,
            plazoPago: plazoPago,
            tiempoEntrega: tiempoEntrega,
            fechaVencimiento: fechaVencimiento + "T00:00:00"
        }));

        return { calculatedSubTotal, calculatedIva, calculatedTotal };
    };

    // Función para añadir un nuevo material
    const handleAddMateriaPrima = (material: Material) => {
        const cantidad = 1;
        const precioUnitario = material.costo;
        const subTotal = cantidad * precioUnitario;
        const ivaPercentage = material.ivaPercentual / 100;
        const ivaCOP = ivaEnabled ? Math.round(subTotal * ivaPercentage) : 0;

        const newItem: ItemOrdenCompra = {
            material: material,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            ivaCOP: ivaCOP,
            subTotal: subTotal,
            cantidadCorrecta: 0,
            precioCorrecto: 0,
        };

        setListaItemsOrdenCompra(prev => [...prev, newItem]);
        updateTotalesAndGetValues();
    };

    // Función para eliminar un item
    const handleRemoveItem = (index: number) => {
        const newList = listaItemsOrdenCompra.filter((_, i) => i !== index);
        setListaItemsOrdenCompra(newList);
        updateTotalesAndGetValues();
    };

    // Función para actualizar un item
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

        item.subTotal = item.cantidad * item.precioUnitario;
        const ivaPercentage = item.material.ivaPercentual / 100;
        item.ivaCOP = ivaEnabled ? Math.round(item.subTotal * ivaPercentage) : 0;

        newList[index] = item;
        setListaItemsOrdenCompra(newList);
        updateTotalesAndGetValues();
    };

    // Función para alternar IVA para todos los items
    const toggleIvaForAllItems = (enabled: boolean) => {
        setIvaEnabled(enabled);
        const newList = [...listaItemsOrdenCompra];
        newList.forEach(item => {
            const ivaPercentage = item.material.ivaPercentual / 100;
            item.ivaCOP = enabled ? Math.round(item.subTotal * ivaPercentage) : 0;
        });
        setListaItemsOrdenCompra(newList);
        updateTotalesAndGetValues();
    };

    // Actualizar ordenActual cuando cambian los campos adicionales
    const handleCondicionPagoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCondicionPago(value);
        // Si la condición de pago es "Contado", establecer el plazo de pago a 0
        if (value === "1") {
            setPlazoPago(0);
        }
        setOrdenActual(prev => ({
            ...prev,
            condicionPago: value
        }));
    };

    const handlePlazoPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setPlazoPago(value);
        setOrdenActual(prev => ({
            ...prev,
            plazoPago: value
        }));
    };

    const handleTiempoEntregaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTiempoEntrega(value);
        setOrdenActual(prev => ({
            ...prev,
            tiempoEntrega: value
        }));
    };

    const handleFechaVencimientoChange = (date: string) => {
        setFechaVencimiento(date);
        setOrdenActual(prev => ({
            ...prev,
            fechaVencimiento: date + "T00:00:00"
        }));
    };

    // Función para guardar los cambios
    const handleGuardarCambios = async () => {
        try {
            const response = await axios.put(
                `${endPoints.update_orden_compra}/${ordenActual.ordenCompraId}`,
                ordenActual,
                { headers: { 'Content-Type': 'application/json' } }
            );

            toast({
                title: 'Orden actualizada',
                description: 'La orden de compra ha sido actualizada exitosamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onVolver(); // Volver a la pantalla de búsqueda
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error al actualizar',
                description: 'Hubo un error al actualizar la orden de compra.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex direction="column" p="1em" gap="4">
            <Flex justify="space-between" align="center">
                <Heading size="md">Editar Orden de Compra #{ordenActual.ordenCompraId}</Heading>
                <Button colorScheme="gray" onClick={onVolver}>
                    Volver a Búsqueda
                </Button>
            </Flex>

            <Box p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Proveedor: {ordenActual.proveedor.nombre}</Text>
                <Text>Fecha Emisión: {ordenActual.fechaEmision ? new Date(ordenActual.fechaEmision).toLocaleDateString() : '-'}</Text>
            </Box>

            {/* Nuevos campos de formulario */}
            <Flex direction="row" gap={4} wrap="wrap">
                <FormControl>
                    <FormLabel>Condición de Pago</FormLabel>
                    <Select
                        value={condicionPago}
                        onChange={handleCondicionPagoChange}
                        width="200px"
                    >
                        <option value="0">Crédito</option>
                        <option value="1">Contado</option>
                    </Select>
                </FormControl>

                <FormControl isRequired={condicionPago === "0"} isDisabled={condicionPago === "1"}>
                    <FormLabel>Plazo de pago (días)</FormLabel>
                    <Input
                        value={plazoPago}
                        onChange={handlePlazoPagoChange}
                        type="number"
                        min={0}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Tiempo de entrega (días)</FormLabel>
                    <Input
                        value={tiempoEntrega}
                        onChange={handleTiempoEntregaChange}
                    />
                </FormControl>

                <MyDatePicker
                    date={fechaVencimiento}
                    setDate={handleFechaVencimientoChange}
                    defaultDate={format(new Date(), "yyyy-MM-dd")}
                    label={"Fecha de Vencimiento Orden"}
                />
            </Flex>

            <Button colorScheme="blue" onClick={() => setIsMateriaPrimaPickerOpen(true)}>
                Agregar Material
            </Button>

            <ListaItemsOCM
                items={listaItemsOrdenCompra}
                onRemoveItem={handleRemoveItem}
                onUpdateItem={handleUpdateItem}
                ivaEnabled={ivaEnabled}
                onToggleIva={toggleIvaForAllItems}
            />

            <Flex justify="flex-end" gap={4}>
                <Button colorScheme="red" onClick={onVolver}>
                    Cancelar
                </Button>
                <Button colorScheme="teal" onClick={handleGuardarCambios}>
                    Guardar Cambios
                </Button>
            </Flex>

            {/* MateriaPrimaPicker Modal */}
            <MateriaPrimaPicker
                isOpen={isMateriaPrimaPickerOpen}
                onClose={() => setIsMateriaPrimaPickerOpen(false)}
                onSelectMateriaPrima={handleAddMateriaPrima}
            />
        </Flex>
    );
}
