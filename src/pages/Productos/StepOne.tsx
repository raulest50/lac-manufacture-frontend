// StepOneComponent.tsx
import {
    Button,
    Flex, FormControl, FormLabel, GridItem, HStack, Input, Select, SimpleGrid, Textarea,
} from "@chakra-ui/react";
import {useState} from "react";
import {ProductoSemiter, UNIDADES, TIPOS_PRODUCTOS} from "./types.tsx";


interface props {
    setActiveStep: (step: number) => void;
}

export default function StepOne({setActiveStep}: props) {
    // Local copy of the order's items to track verification state.

    const [semioter, setSemioter] = useState<ProductoSemiter>();

    const [productoId, setProductoId] = useState<string>();
    const [nombre, setNombre] = useState<string>();
    const [costo, setCosto] = useState<string>();
    const [tipoUnidades, setTipoUnidades] = useState<string>();
    const [cantidadUnidad, setCantidadUnidad] = useState<string>();
    const [observaciones, setObservaciones] = useState<string>();
    const [tipo_producto, setTipo_producto] = useState<string>();


    const onClickBorrarCampos = () => {

    }

    const ValidarDatos = (): boolean => {

    };

    const onClickSiguiente = () => {


        setActiveStep(1);
    }

    return (
        <Flex direction="column" gap={4} align="center">
            <SimpleGrid w="full" h="full" columns={3} gap="2em">

                <GridItem colSpan={1}>
                    <FormControl isRequired={true}>
                        <FormLabel>Codigo Id</FormLabel>
                        <Input
                            value={productoId}
                            onChange={(e) => setProductoId(e.target.value)}
                            variant="filled"
                        />
                    </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                    <FormControl isRequired={true}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            variant="filled"
                        />
                    </FormControl>
                </GridItem>

                <GridItem colSpan={1}>
                    <Flex w="full" direction="row" align="flex-end" justify="space-around" gap={4}>
                        <Select
                            flex="1"
                            value={tipoUnidades}
                            onChange={(e) => setTipoUnidades(e.target.value)}
                        >
                            <option value={UNIDADES.KG}>{UNIDADES.KG}</option>
                            <option value={UNIDADES.L}>{UNIDADES.L}</option>
                            <option value={UNIDADES.U}>{UNIDADES.U}</option>
                        </Select>
                        <FormControl flex="4" isRequired>
                            <FormLabel>Contenido por envase</FormLabel>
                            <Input
                                value={cantidadUnidad}
                                onChange={(e) => setCantidadUnidad(e.target.value)}
                                variant="filled"
                            />
                        </FormControl>
                    </Flex>
                </GridItem>

                <GridItem colSpan={1}>
                    <Flex w="full" direction="row" align="flex-end" justify="space-around" gap={4}>
                        <FormControl>
                            <FormLabel> Seleccionar Tipo de Producto</FormLabel>
                            <Select
                                flex="1"
                                value={tipo_producto}
                                onChange={(e) => setTipo_producto(e.target.value)}
                            >
                                <option value={TIPOS_PRODUCTOS.semiTerminado}>Semiterminado</option>
                                <option value={TIPOS_PRODUCTOS.Terminado}>Terminado</option>
                            </Select>
                        </FormControl>
                    </Flex>
                </GridItem>

                <GridItem colSpan={3}>
                    <FormControl isRequired>
                        <FormLabel>Observaciones</FormLabel>
                        <Textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            variant="filled"
                        />
                    </FormControl>
                </GridItem>


            </SimpleGrid>
            <HStack>
                <Button
                    variant={"solid"}
                    colorScheme={"red"}
                    onClick={onClickBorrarCampos}
                >
                    Borrar Campos
                </Button>

                <Button
                    variant={"solid"}
                    colorScheme={"teal"}
                    onClick={onClickSiguiente}
                >
                    Siguiente
                </Button>
            </HStack>
        </Flex>
    );
}
