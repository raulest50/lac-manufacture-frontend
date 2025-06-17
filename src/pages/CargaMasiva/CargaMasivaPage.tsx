import { useState } from "react";
import { 
    Container, 
    Button, 
    Input, 
    VStack, 
    HStack, 
    Text, 
    Divider, 
    Box,
    useToast,
    FormControl,
    FormLabel,
    FormHelperText
} from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader";
import axios, { AxiosError } from "axios";
import EndPointsURL from "../../api/EndPointsURL";

export default function CargaMasivaPage() {
    const [proveedoresLink, setProveedoresLink] = useState<string>("");
    const [productosLink, setProductosLink] = useState<string>("");
    const [isLoadingProveedores, setIsLoadingProveedores] = useState<boolean>(false);
    const [isLoadingProductos, setIsLoadingProductos] = useState<boolean>(false);
    const toast = useToast();


    // Implementación de la carga masiva de proveedores
    const handleProveedoresUpload = async () => {
        if (!proveedoresLink) return;

        setIsLoadingProveedores(true);

        try {
            // Verificar que la URL sea de Google Sheets
            if (!proveedoresLink.includes("docs.google.com/spreadsheets")) {
                throw new Error("La URL debe ser de un archivo de Google Sheets");
            }

            // Convertir la URL de Google Sheets a una URL de descarga directa
            // Formato típico: https://docs.google.com/spreadsheets/d/FILE_ID/edit?usp=sharing
            let fileId = "";

            // Extraer el ID del archivo de la URL de Google Sheets
            const match = proveedoresLink.match(/spreadsheets\/d\/([^\/]+)/);
            if (match && match[1]) {
                fileId = match[1];
            }

            if (!fileId) {
                throw new Error("No se pudo extraer el ID del archivo de la URL proporcionada");
            }

            // Crear la URL de descarga directa para Google Sheets (exportar como Excel)
            const downloadUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;

            // Descargar el archivo
            const response = await axios.get(downloadUrl, {
                responseType: 'blob'
            });

            // Crear un objeto FormData para enviar el archivo
            const formData = new FormData();
            const file = new File([response.data], "proveedores.xlsx", { 
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
            });
            formData.append("file", file);

            // Enviar el archivo al backend
            const uploadResponse = await axios.post(
                new EndPointsURL().bulk_upload_proveedores,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Mostrar mensaje de éxito
            const data = uploadResponse.data;
            toast({
                title: "Carga exitosa",
                description: `Se han procesado ${data.totalRecords} registros. ${data.successCount} exitosos, ${data.failureCount} fallidos.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Limpiar el campo de entrada
            setProveedoresLink("");

        } catch (error) {
            // Manejar errores
            const err = error as Error | AxiosError;
            let errorMessage = "Ha ocurrido un error al cargar los proveedores.";

            if (axios.isAxiosError(err)) {
                // Error de red o del servidor
                errorMessage = err.response?.data?.message || err.message;
            } else {
                // Error de la aplicación
                errorMessage = err.message;
            }

            toast({
                title: "Error en la carga",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoadingProveedores(false);
        }
    };

    const handleProductosUpload = async () => {
        if (!productosLink) return;

        setIsLoadingProductos(true);

        try {
            // Verificar que la URL sea de Google Sheets
            if (!productosLink.includes("docs.google.com/spreadsheets")) {
                throw new Error("La URL debe ser de un archivo de Google Sheets");
            }

            // Convertir la URL de Google Sheets a una URL de descarga directa
            let fileId = "";

            // Extraer el ID del archivo de la URL de Google Sheets
            const match = productosLink.match(/spreadsheets\/d\/([^\/]+)/);
            if (match && match[1]) {
                fileId = match[1];
            }

            if (!fileId) {
                throw new Error("No se pudo extraer el ID del archivo de la URL proporcionada");
            }

            // Crear la URL de descarga directa para Google Sheets (exportar como Excel)
            const downloadUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;

            // Descargar el archivo
            const response = await axios.get(downloadUrl, {
                responseType: 'blob'
            });

            // Crear un objeto FormData para enviar el archivo
            const formData = new FormData();
            const file = new File([response.data], "productos.xlsx", { 
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
            });
            formData.append("file", file);

            // Enviar el archivo al backend
            const uploadResponse = await axios.post(
                new EndPointsURL().bulk_upload_productos,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Mostrar mensaje de éxito
            const data = uploadResponse.data;
            toast({
                title: "Carga exitosa",
                description: `Se han procesado ${data.totalRecords} registros. ${data.successCount} exitosos, ${data.failureCount} fallidos.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Limpiar el campo de entrada
            setProductosLink("");

        } catch (error) {
            // Manejar errores
            const err = error as Error | AxiosError;
            let errorMessage = "Ha ocurrido un error al cargar los productos.";

            if (axios.isAxiosError(err)) {
                // Error de red o del servidor
                errorMessage = err.response?.data?.message || err.message;
            } else {
                // Error de la aplicación
                errorMessage = err.message;
            }

            toast({
                title: "Error en la carga",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            // Add a longer delay to ensure the loading animation is visible
            setTimeout(() => {
                setIsLoadingProductos(false);
            }, 2000); // Increased to 2 seconds
        }
    };

    return (
        <Container minW={["auto", "container.lg", "container.xl"]} w="full" h="full">
            <MyHeader title="Carga Masiva" />

            <VStack spacing={8} align="stretch" w="full">
                {/* Carga Masiva de Proveedores */}
                <Box p={5} borderWidth="1px" borderRadius="lg">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Carga Masiva de Proveedores
                    </Text>
                    <FormControl>
                        <FormLabel>URL del archivo Excel en Google Sheets</FormLabel>
                        <HStack spacing={4}>
                            <Input 
                                placeholder="Ingrese el enlace de Google Sheets para carga de proveedores"
                                value={proveedoresLink}
                                onChange={(e) => setProveedoresLink(e.target.value)}
                                flex={1}
                            />
                            <Button 
                                colorScheme="blue" 
                                onClick={handleProveedoresUpload}
                                isDisabled={!proveedoresLink || isLoadingProveedores}
                                isLoading={isLoadingProveedores}
                                loadingText="Cargando..."
                            >
                                Cargar Proveedores
                            </Button>
                        </HStack>
                        <FormHelperText>
                            Pegue la URL de un archivo Excel compartido públicamente en Google Sheets
                        </FormHelperText>
                    </FormControl>
                </Box>

                <Divider />

                {/* Carga Masiva de Productos */}
                <Box p={5} borderWidth="1px" borderRadius="lg">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Carga Masiva de Productos
                    </Text>
                    <FormControl>
                        <FormLabel>URL del archivo Excel en Google Sheets</FormLabel>
                        <HStack spacing={4}>
                            <Input 
                                placeholder="Ingrese el enlace de Google Sheets para carga de productos"
                                value={productosLink}
                                onChange={(e) => setProductosLink(e.target.value)}
                                flex={1}
                            />
                            <Button 
                                colorScheme="green" 
                                onClick={handleProductosUpload}
                                isDisabled={!productosLink || isLoadingProductos}
                                isLoading={isLoadingProductos}
                                loadingText="Cargando..."
                            >
                                Cargar Productos
                            </Button>
                        </HStack>
                        <FormHelperText>
                            Pegue la URL de un archivo Excel compartido públicamente en Google Sheets
                        </FormHelperText>
                    </FormControl>
                </Box>
            </VStack>
        </Container>
    );
}
