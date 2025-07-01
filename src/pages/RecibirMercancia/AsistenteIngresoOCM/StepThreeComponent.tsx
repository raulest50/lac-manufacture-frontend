

import {IngresoOCM_DTA} from "../types";
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Icon,
    Text,
    Image,
    Textarea,
    FormControl, 
    FormLabel,
    Badge
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import {useState} from "react";
import axios from "axios";
import EndPointsURL from "../../../api/EndPointsURL";


interface StepThreeComponentProps {
    setActiveStep: (step: number) => void;
    docIngresoDTA: IngresoOCM_DTA | null;
}

const endpoints = new EndPointsURL();

export default function StepThreeComponent({
                                             setActiveStep,
                                             docIngresoDTA,
                                         }: StepThreeComponentProps) {

    const [observaciones, setObservaciones] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onClickEnviar = async () => {
        if (!docIngresoDTA || !docIngresoDTA.file) {
            console.error("No document data or file provided");
            return;
        }

        // Activar el estado de carga
        setIsLoading(true);

        // Create a copy of the docIngresoDTA excluding the file property.
        const { file, ...docData } = docIngresoDTA;

        // Renombrar ordenCompra a ordenCompraMateriales para que coincida con lo que espera el backend
        const docDataWithRenamedProperty = {
            ...docData,
            ordenCompraMateriales: docData.ordenCompra,
        };
        delete docDataWithRenamedProperty.ordenCompra;

        // Build FormData.
        const formData = new FormData();
        formData.append(
            "docIngresoDTA",
            new Blob([JSON.stringify(docDataWithRenamedProperty)], { type: "application/json" })
        );
        formData.append("file", file);

        try {
            const response = await axios.post(endpoints.save_doc_ingreso_oc, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("DocIngreso created successfully:", response.data);
            // Optionally, proceed to the next step or update UI accordingly.
            setActiveStep(4);
        } catch (error) {
            console.error("Error creating DocIngreso:", error);
        } finally {
            // Desactivar el estado de carga independientemente del resultado
            setIsLoading(false);
        }
    };


    return (
        <Flex
            p="1em"
            direction="column"
            backgroundColor="blue.50"
            gap={8}
            alignItems="center"
        >
            <Heading fontFamily="Comfortaa Variable">
                Formato De Ingreso A Almacen
            </Heading>
            <Text fontFamily="Comfortaa Variable">
                Verifique el formato de ingreso a almacen. En caso de algun error regrese al paso 1.
            </Text>
            <Text fontFamily="Comfortaa Variable">
                Si el formato esta bien, continue con el envio del mismo para finalizar el procedimiento y dar ingreso de los items a el almacen
            </Text>

            <Divider/>

            {/* Materiales y Lotes */}
            <Box w="full" overflowX="auto">
                <Heading size="md" mb={4}>Materiales y Lotes</Heading>
                {docIngresoDTA?.transaccionAlmacen.movimientosTransaccion.map((movimiento, index) => (
                    <Box key={index} mb={4} p={3} borderWidth="1px" borderRadius="md">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Box>
                                <Text fontWeight="bold">{movimiento.producto.nombre}</Text>
                                <Text>ID: {movimiento.producto.productoId}</Text>
                            </Box>
                            <Badge colorScheme="green">{movimiento.cantidad} {movimiento.producto.tipoUnidades}</Badge>
                        </Flex>
                        <Divider my={2} />
                        <Text fontWeight="bold">Información del Lote:</Text>
                        <Text>Fecha de Fabricación: {new Date(movimiento.lote.productionDate).toLocaleDateString()}</Text>
                        <Text>Fecha de Vencimiento: {new Date(movimiento.lote.expirationDate).toLocaleDateString()}</Text>
                    </Box>
                ))}
            </Box>


            <Text fontFamily="Comfortaa Variable">
                Documento Soporte:
            </Text>
            <Box w={"full"}>
                <Image
                    src={docIngresoDTA ? URL.createObjectURL(docIngresoDTA.file) : ""}
                    alt="Documento Soporte"
                    objectFit="contain"
                    borderRadius="md"
                    boxSize="100%"
                />
            </Box>

            <FormControl>
                <FormLabel>Observaciones (Opcional) </FormLabel>
                <Textarea
                    placeholder='Escriba aqui sus observaciones si lo considera pertinente'
                    value={observaciones}
                    onChange={(e) => {
                        docIngresoDTA ? docIngresoDTA.observaciones = e.target.value : {};
                        setObservaciones(e.target.value);
                        }
                    }
                >

                </Textarea>
            </FormControl>


            <Divider/>

            <Button
                variant="solid"
                colorScheme={"teal"}
                onClick={onClickEnviar}
                isLoading={isLoading}
                loadingText="Enviando..."
            >
                Enviar Formato De Ingreso
            </Button>

        </Flex>
    );

}
