// CrearOrdenCompraActivos.tsx
import {
    Container, Flex, FormControl, FormLabel, Input, Select,
    useToast, Text, Heading, Button, HStack, Spacer
} from "@chakra-ui/react";
import ProveedorCard from "./components/ProveedorCard.tsx";
import { useState } from "react";
import {Proveedor, ItemOCActivo, OrdenCompraActivos} from "./types.tsx";     // ← import Activo types
import ProveedorPicker from "./components/ProveedorPicker.tsx";
import MyDatePicker from "../../components/MyDatePicker.tsx";
import { addDays, format } from "date-fns";
import ListaItemsOCA from "./components/ListaItemsOCA.tsx";
import PdfGenerator from "./pdfGenerator.tsx";

export default function CrearOCA() {
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

    const toast = useToast();

    const clearAll = () => {
        setSelectedProveedor(null);
        setListaItemsActivos([]);
        setOrdenCompraId("");
        setPlazoPago(30);
        setCondicionPago("0");
        setTiempoEntrega("15");
        setFechaVencimiento(format(addDays(new Date(), 30), "yyyy-MM-dd"));
        setIsProveedorPickerOpen(false);
    }

    const generarPDF = async () => {
        if (!selectedProveedor) {
            toast({
                title: "Proveedor faltante",
                description: "Selecciona primero un proveedor antes de generar el PDF.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // build the payload
        const orden: OrdenCompraActivos = {
            ordenCompraId: ordenCompraId || `AUTO-${Date.now()}`,
            fechaEmision: format(new Date(), "yyyy-MM-dd"),
            fechaVencimiento,
            proveedor: selectedProveedor,
            itemsOrdenCompra: listaItemsActivos,
            subTotal: listaItemsActivos.reduce(
                (sum, row) => sum + row.activo.precio * row.cantidad,
                0
            ),
            ivaValue: listaItemsActivos.reduce(
                (sum, row) => sum + row.activo.ivaValue * row.cantidad,
                0
            ),
            totalPagar: listaItemsActivos.reduce((sum, row) => sum + row.subTotal, 0),
            condicionPago,
            tiempoEntrega,
            plazoPago,
        };

        const generator = new PdfGenerator();
        await generator.generatePDF_OCA(orden);
    }

    return (
        <Container minW={['auto','container.lg','container.xl']} w="full" h="full">
            <Flex direction="column" p={0} m={0} w="full" h="full" gap={10}>
                <ProveedorCard
                    selectedProveedor={selectedProveedor}
                    onSearchClick={() => setIsProveedorPickerOpen(true)}
                />

                <Flex direction={"row"} mt={"1em"} w="full" h="full" gap={"2"} p={"1em"}>
                    <FormControl flex={1}>
                        <FormLabel>Orden Compra Id</FormLabel>
                        <Input
                            value={ordenCompraId}
                            onChange={ (e) => {setOrdenCompraId(e.target.value)} }
                        />
                    </FormControl>
                    <Spacer flex={2}/>
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
                        colorScheme={"blue"}
                        variant={"solid"}
                        onClick={generarPDF}
                    >
                        Generar Pdf
                    </Button>
                    <Button
                        colorScheme={"red"}
                        variant={"solid"}
                        onClick={clearAll}
                    >
                        Limpiar Campos
                    </Button>
                </HStack>

                <Flex
                    direction="column"
                    p="1em"
                    w="full" h="full"
                    alignItems="flex-start"
                    boxShadow="md"
                    bg="red.50"
                >
                    <Heading as="h3" size="sm">Nota importante:</Heading>
                    <Text noOfLines={3}>
                        La presente interfaz es de uso provisional.
                        Es únicamente para la generación manual de órdenes de compra.
                        Id, valores de iva entre otros deben ser asignadas manualmente.
                    </Text>
                </Flex>
            </Flex>

            <ProveedorPicker
                isOpen={isProveedorPickerOpen}
                onClose={() => setIsProveedorPickerOpen(false)}
                onSelectProveedor={(p) => setSelectedProveedor(p)}
            />
        </Container>
    );
}
