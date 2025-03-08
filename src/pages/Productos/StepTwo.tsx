import {ProductoSemiter, Producto, TIPOS_PRODUCTOS} from "./types.tsx";
import {useState} from "react";
import {
    Button,
    Flex, FormControl, FormLabel,
    HStack,
    Input, Select,
} from "@chakra-ui/react";
import SemioterBriefCard from "./components/SemioterBriefCard.tsx";


interface props {
    setActiveStep: (step: number) => void;
    semioter: ProductoSemiter;
}

export default function StepTwo({setActiveStep, semioter}:props){

    const TIPO_BUSQUEDA = {nombre:"Nombre", id:"Id"}

    const [listaMp, setListaMp] = useState<Producto[]>([]);
    const [listaSemi, setListaSemi] = useState<Producto[]>([]);
    const [selectedIsumos, setSelectedInsumos] = useState();

    const [costo, setCosto] = useState(0);

    const [searchString, setSearchString] = useState("");
    const [clasificacionBusqueda, setClasificacionBusqueda] = useState(TIPOS_PRODUCTOS.Terminado);
    const [tipoBusqueda, setTipoBusqueda] = useState(TIPO_BUSQUEDA.nombre);

    const onClickSiguiente = () => {

    };

    /** GPT
     * I want this function to reset everything to initial state
     * so check if what i've already wrote is enough. If not improve this method
     */
    const onClickCleanLists = () => {
        setListaMp([]);
        setListaSemi([]);
        setCosto(0);
    };


    const onClickBuscar = () => {
        /** GPT
         *
         */
    };

    return(
        <Flex direction="column" gap={4} align="center">

            <SemioterBriefCard semioter={semioter} />

            <Flex direction={"row"} gap={"3em"} w={"full"}>
                <FormControl flex={3} >
                    <FormLabel>Buscar:</FormLabel>
                    <Input
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                    />
                </FormControl>

                <FormControl flex={1}>
                    <FormLabel>Tipo Busqueda:</FormLabel>
                    <Select
                        flex="1"
                        value={tipoBusqueda}
                        onChange={(e) => setTipoBusqueda(e.target.value)}
                    >
                        <option value={TIPO_BUSQUEDA.nombre}>Nombre</option>
                        <option value={TIPO_BUSQUEDA.id}>Id</option>
                    </Select>
                </FormControl>

                <FormControl flex={1} >
                    <FormLabel>Seleccion:</FormLabel>
                    <Select
                        flex="1"
                        value={clasificacionBusqueda}
                        onChange={(e) => setClasificacionBusqueda(e.target.value)}
                    >
                        <option value={TIPOS_PRODUCTOS.Terminado}>Terminado</option>
                        <option value={TIPOS_PRODUCTOS.semiTerminado}>Semiterminado</option>
                    </Select>
                </FormControl>
                <Button
                    onClick={onClickBuscar}
                >

                </Button>
            </Flex>

            <HStack gap={8}>

                <Flex direction={"column"} align={"center"}>
                    {
                        /** GPT
                         * here i want a table with chakra ui v 2.0
                         * to display the list of materiasPrimas (listaMp) or
                         *
                         *
                         */
                    }
                </Flex>

                <Flex direction={"column"} align={"center"}>
                    {
                        /** GPT
                         *
                         *
                         *
                         */
                    }
                </Flex>

            </HStack>

            <Flex direction={"row"} gap={10}>
                <Button
                    variant = {"solid"}
                    colorScheme={"teal"}
                    onClick={onClickSiguiente}
                >
                    Siguiente
                </Button>

                <Button
                    variant = {"solid"}
                    colorScheme={"red"}
                    onClick={onClickCleanLists}
                >
                    Limpiar Bandeja Seleccion
                </Button>

            </Flex>

        </Flex>
    );
}