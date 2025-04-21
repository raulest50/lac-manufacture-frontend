// CrearOrdenCompraActivos.tsx
import {
    Container, Flex, FormControl, FormLabel, Input, Select,
    useToast, Text, Heading, Button, HStack
} from "@chakra-ui/react";
import ProveedorCard from "./components/ProveedorCard.tsx";
import { useState } from "react";
import { Proveedor, ItemOCActivo } from "./types.tsx";     // ← import Activo types
import ProveedorPicker from "./components/ProveedorPicker.tsx";
import MyDatePicker from "../../components/MyDatePicker.tsx";
import { addDays, format } from "date-fns";
import ListaItemsActivos from "./components/ListaItemsActivos.tsx";

export default function CrearOrdenCompraActivos() {
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [isProveedorPickerOpen, setIsProveedorPickerOpen] = useState(false);

    // NEW: state for activos
    const [listaItemsActivos, setListaItemsActivos] = useState<ItemOCActivo[]>([]);

    const [plazoPago, setPlazoPago] = useState(30);
    const [condicionPago, setCondicionPago] = useState("0");
    const [tiempoEntrega, setTiempoEntrega] = useState("15");
    const [fechaVencimiento, setFechaVencimiento] = useState(
        format(addDays(new Date(), 30), "yyyy-MM-dd")
    );

    const toast = useToast();

    const clearAll = () => {

    }

    const generarPDF = () => {

    }

    return (
        <Container minW={['auto','container.lg','container.xl']} w="full" h="full">
            <Flex direction="column" p={0} m={0} w="full" h="full" gap={10}>
                <ProveedorCard
                    selectedProveedor={selectedProveedor}
                    onSearchClick={() => setIsProveedorPickerOpen(true)}
                />

                {/* … your Condición/Plazo/Fecha picker UI … */}

                {/* pass down activos list + setter */}
                <ListaItemsActivos
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
