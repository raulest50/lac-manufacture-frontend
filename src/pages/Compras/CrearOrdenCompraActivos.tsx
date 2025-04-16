import {
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    Text,
    Heading,
} from "@chakra-ui/react";
import ProveedorCard from "./components/ProveedorCard.tsx";
import {useState} from "react";
import {ItemOrdenCompra, Proveedor} from "./types.tsx";
import ProveedorPicker from "./components/ProveedorPicker.tsx";
import MyDatePicker from "../../components/MyDatePicker.tsx";
import {addDays, format} from "date-fns";
import ListaItemsActivos from "./components/ListaItemsActivos.tsx";


export default function CrearOrdenCompraActivos() {

    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);

    const [listaItemsOrdenCompra, setListaItemsOrdenCompra] = useState<ItemOrdenCompra[]>([]);

    const [plazoPago, setPlazoPago] = useState(30);
    const [condicionPago, setCondicionPago] = useState("0");
    const [tiempoEntrega, setTiempoEntrega] = useState("15");
    const [fechaVencimiento, setFechaVencimiento] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"));

    const toast = useToast();


    return(
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <Flex direction={"column"} p={0} m={0} w={"full"} h={"full"}>
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

                <ListaItemsActivos />

                <Flex direction={"column"} p={"1em"} w={"full"} h={"full"} alignItems={"flex-start"} boxShadow={"md"} bg={"red.50"}>
                    <Heading as={"h3"} size={"sm"}> Nota importante:</Heading>
                    <Text noOfLines={3}>
                        La presente interfaz es de uso provivional.
                        Es unicamente para la generacion manual de ordenes de compra.
                        Id, valores de iva entre otros deben ser asignadas manualmente.
                    </Text>
                </Flex>

            </Flex>

            {/* ProveedorPicker Modal */}
            <ProveedorPicker
                isOpen={isProveedorPickerOpen}
                onClose={() => setIsProveedorPickerOpen(false)}
                onSelectProveedor={(proveedor) => setSelectedProveedor(proveedor)}
            />

        </Container>

    )
}