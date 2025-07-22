// CrearOrdenCompraActivos.tsx
import {
    Container, Flex, FormControl, FormLabel, Input, Select,
    useToast, Button, HStack, Spacer
} from "@chakra-ui/react";
import ProveedorCard from "../../Compras/components/ProveedorCard.tsx";
import { useState } from "react";
import {Proveedor, ItemOCActivo, OrdenCompraActivos} from "../../Compras/types.tsx";     // ← import Activo types
import ProveedorPicker from "../../Compras/components/ProveedorPicker.tsx";
import MyDatePicker from "../../../components/MyDatePicker.tsx";
import { addDays, format } from "date-fns";
import ListaItemsOCA from "../../Compras/components/ListaItemsOCA.tsx";
import PdfGenerator from "../../Compras/pdfGenerator.tsx";
// Importar el componente SelectCurrencyTrm
import { SelectCurrencyTrm } from "../../../components/SelectCurrencyTRM/SelectCurrencyTRM";

export default function CrearOC_AF() {
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);

    // NEW: state for Activos
    const [listaItemsActivos, setListaItemsActivos] = useState<ItemOCActivo[]>([]);

    const [ordenCompraId, setOrdenCompraId] = useState("");
    const [plazoPago, setPlazoPago] = useState(30);
    const [condicionPago, setCondicionPago] = useState("0");
    const [tiempoEntrega, setTiempoEntrega] = useState("15");
    const [fechaVencimiento, setFechaVencimiento] = useState(
        format(addDays(new Date(), 30), "yyyy-MM-dd")
    );

    // Nuevos estados para el manejo de moneda y TRM
    const [isUSD, setIsUSD] = useState<boolean>(false);
    // Crear un tuple para pasar al componente SelectCurrencyTrm
    const currencyIsUSDTuple: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = [isUSD, setIsUSD];
    const [currentUsd2Cop, setCurrentUsd2Cop] = useState<number>(0);

    const toast = useToast();

    // Función para actualizar el valor de TRM
    const handleTrmUpdate = (value: number) => {
        setCurrentUsd2Cop(value);
    };

    const clearAll = () => {
        setSelectedProveedor(null);
        setListaItemsActivos([]);
        setOrdenCompraId("");
        setPlazoPago(30);
        setCondicionPago("0");
        setTiempoEntrega("15");
        setFechaVencimiento(format(addDays(new Date(), 30), "yyyy-MM-dd"));
        setIsProveedorPickerOpen(false);
        setIsUSD(false);
        setCurrentUsd2Cop(0);
    }

    return (
        <Container minW={['auto','container.lg','container.xl']} w="full" h="full">
            <Flex direction="column" p={0} m={0} w="full" h="full" gap={10}>

                <Flex direction={"row"} gap={2} w={"full"} h={"full"} p={"1em"} >
                    <Flex flex={2} w={"full"}>
                        <ProveedorCard
                            selectedProveedor={selectedProveedor}
                            onSearchClick={() => setIsProveedorPickerOpen(true)}
                        />
                    </Flex>
                    <Flex flex={1} w={"full"}>
                        {/* Componente de selección de moneda y TRM */}
                        <FormControl>
                            <FormLabel>Moneda y TRM</FormLabel>
                            <SelectCurrencyTrm
                                currencyIsUSD={currencyIsUSDTuple}
                                useCurrentUsd2Cop={handleTrmUpdate}
                            />
                        </FormControl>
                    </Flex>
                </Flex>

                <Flex direction={"column"} mt={"1em"} w="full" h="full" gap={"2"} p={"1em"}>
                    <Flex direction={"row"} gap={"2"} >
                        <FormControl>
                            <FormLabel> Condicion de Pago</FormLabel>
                            <Select
                                value={condicionPago}
                                onChange={(e) => {
                                    setCondicionPago(e.target.value)
                                    if (e.target.value == "1") setPlazoPago(0);
                                }
                                }
                                ml={4}
                                width="200px"
                            >
                                <option value="0">Credito</option>
                                <option value="1">Contado</option>
                                <option value="2">Mixto</option>
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

                {/* pass down Activos list + setter */}
                <ListaItemsOCA
                    items={listaItemsActivos}
                    setItems={setListaItemsActivos}
                />

                <HStack gap={20}>
                    <Button
                        colorScheme={"red"}
                        variant={"solid"}
                        onClick={clearAll}
                    >
                        Limpiar Campos
                    </Button>
                    {/* El botón para generar PDF se ha movido al tab de búsqueda de órdenes de compra */}
                </HStack>

            </Flex>

            <ProveedorPicker
                isOpen={isProveedorPickerOpen}
                onClose={() => setIsProveedorPickerOpen(false)}
                onSelectProveedor={(p) => setSelectedProveedor(p)}
            />
        </Container>
    );
}
