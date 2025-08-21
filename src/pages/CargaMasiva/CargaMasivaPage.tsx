import { useState, useRef } from "react";
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
    FormHelperText,
    Icon,
    SimpleGrid,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from "@chakra-ui/react";
import { FaFileCircleCheck, FaFileCircleQuestion } from "react-icons/fa6";
import MyHeader from "../../components/MyHeader";
import axios, { AxiosError } from "axios";
import EndPointsURL from "../../api/EndPointsURL";

export default function CargaMasivaPage() {
    const [proveedoresLink, setProveedoresLink] = useState<string>("");
    const [productosLink, setProductosLink] = useState<string>("");
    const [isLoadingProveedores, setIsLoadingProveedores] = useState<boolean>(false);
    const [isLoadingProductos, setIsLoadingProductos] = useState<boolean>(false);
    const [proveedoresFile, setProveedoresFile] = useState<File | null>(null);
    const [productosFile, setProductosFile] = useState<File | null>(null);
    const proveedoresFileInputRef = useRef<HTMLInputElement>(null);
    const productosFileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    interface ProductMapping {
        descripcion: number;
        unidadMedida: number;
        stock: number;
        productoId: number;
        iva: number;
        puntoReorden: number;
        costoUnitario: number;
    }

    const [mapping, setMapping] = useState<ProductMapping>({
        descripcion: 1,
        unidadMedida: 3,
        stock: 6,
        productoId: 7,
        iva: 8,
        puntoReorden: 9,
        costoUnitario: 10
    });

    const handleMappingChange = (field: keyof ProductMapping, value: number) => {
        setMapping(prev => ({ ...prev, [field]: value }));
    };

    const handleProveedoresFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const lower = file.name.toLowerCase();
            if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
                toast({
                    title: 'Tipo de archivo no permitido',
                    description: 'Solo se permiten archivos de Excel (.xlsx, .xls)',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                e.target.value = '';
                return;
            }
            setProveedoresFile(file);
        }
    };

    const handleProductosFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const lower = file.name.toLowerCase();
            if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
                toast({
                    title: 'Tipo de archivo no permitido',
                    description: 'Solo se permiten archivos de Excel (.xlsx, .xls)',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                e.target.value = '';
                return;
            }
            setProductosFile(file);
        }
    };

    const uploadProveedoresFile = async (file: File) => {
        setIsLoadingProveedores(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await axios.post(
                new EndPointsURL().bulk_upload_proveedores,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'blob'
                }
            );

            const blob = new Blob([uploadResponse.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const contentDisposition = uploadResponse.headers['content-disposition'];
            let filename = 'reporte_proveedores.xlsx';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast({
                title: 'Carga completada',
                description: 'Se ha generado un reporte detallado con los resultados de la carga. Descargando...',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            const err = error as Error | AxiosError;
            let errorMessage = 'Ha ocurrido un error al cargar los proveedores.';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            } else {
                errorMessage = err.message;
            }

            toast({
                title: 'Error en la carga',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoadingProveedores(false);
        }
    };

    const uploadProductosFile = async (file: File) => {
        setIsLoadingProductos(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('mapping', new Blob([JSON.stringify(mapping)], { type: 'application/json' }));

            const uploadResponse = await axios.post(
                new EndPointsURL().bulk_upload_productos,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'blob'
                }
            );

            const blob = new Blob([uploadResponse.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const contentDisposition = uploadResponse.headers['content-disposition'];
            let filename = 'reporte_productos.xlsx';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast({
                title: 'Carga completada',
                description: 'Se ha generado un reporte detallado con los resultados de la carga. Descargando...',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            const err = error as Error | AxiosError;
            let errorMessage = 'Ha ocurrido un error al cargar los productos.';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            } else {
                errorMessage = err.message;
            }

            toast({
                title: 'Error en la carga',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setTimeout(() => {
                setIsLoadingProductos(false);
            }, 2000);
        }
    };

    const handleProveedoresUploadFromFile = async () => {
        if (!proveedoresFile) return;
        await uploadProveedoresFile(proveedoresFile);
        setProveedoresFile(null);
    };

    const handleProductosUploadFromFile = async () => {
        if (!productosFile) return;
        await uploadProductosFile(productosFile);
        setProductosFile(null);
    };


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
            const match = proveedoresLink.match(/spreadsheets\/d\/([^/]+)/);
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
                    },
                    responseType: 'blob' // Cambiar para manejar archivos
                }
            );

            // Procesar la respuesta como un archivo para descargar
            const blob = new Blob([uploadResponse.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Obtener el nombre del archivo de las cabeceras de respuesta si está disponible
            const contentDisposition = uploadResponse.headers['content-disposition'];
            let filename = 'reporte_proveedores.xlsx';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // Mostrar mensaje de éxito
            toast({
                title: "Carga completada",
                description: "Se ha generado un reporte detallado con los resultados de la carga. Descargando...",
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
            const match = productosLink.match(/spreadsheets\/d\/([^/]+)/);
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
            formData.append("mapping", new Blob([JSON.stringify(mapping)], { type: "application/json" }));

            // Enviar el archivo al backend
            const uploadResponse = await axios.post(
                new EndPointsURL().bulk_upload_productos,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'blob' // Cambiar para manejar archivos
                }
            );

            // Procesar la respuesta como un archivo para descargar
            const blob = new Blob([uploadResponse.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Obtener el nombre del archivo de las cabeceras de respuesta si está disponible
            const contentDisposition = uploadResponse.headers['content-disposition'];
            let filename = 'reporte_productos.xlsx';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // Mostrar mensaje de éxito
            toast({
                title: "Carga completada",
                description: "Se ha generado un reporte detallado con los resultados de la carga. Descargando...",
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
                    <FormControl mt={4}>
                        <FormLabel>Archivo Excel local</FormLabel>
                        <HStack spacing={4}>
                            <Button onClick={() => proveedoresFileInputRef.current?.click()}>Seleccionar archivo</Button>
                            <Input
                                type="file"
                                ref={proveedoresFileInputRef}
                                style={{ display: 'none' }}
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={handleProveedoresFileChange}
                            />
                            <Icon
                                as={proveedoresFile ? FaFileCircleCheck : FaFileCircleQuestion}
                                boxSize="2em"
                                color={proveedoresFile ? 'green' : 'orange.500'}
                            />
                            <Button
                                colorScheme="blue"
                                onClick={handleProveedoresUploadFromFile}
                                isDisabled={!proveedoresFile || isLoadingProveedores}
                                isLoading={isLoadingProveedores}
                                loadingText="Cargando..."
                            >
                                Cargar Proveedores
                            </Button>
                        </HStack>
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
                    <FormControl mt={4}>
                        <FormLabel>Archivo Excel local</FormLabel>
                        <HStack spacing={4}>
                            <Button onClick={() => productosFileInputRef.current?.click()}>Seleccionar archivo</Button>
                            <Input
                                type="file"
                                ref={productosFileInputRef}
                                style={{ display: 'none' }}
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={handleProductosFileChange}
                            />
                            <Icon
                                as={productosFile ? FaFileCircleCheck : FaFileCircleQuestion}
                                boxSize="2em"
                                color={productosFile ? 'green' : 'orange.500'}
                            />
                            <Button
                                colorScheme="green"
                                onClick={handleProductosUploadFromFile}
                                isDisabled={!productosFile || isLoadingProductos}
                                isLoading={isLoadingProductos}
                                loadingText="Cargando..."
                            >
                                Cargar Productos
                            </Button>
                        </HStack>
                    </FormControl>
                    <Box mt={6}>
                        <Text fontWeight="semibold" mb={2}>Mapeo de Columnas (0-based)</Text>
                        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                            <FormControl>
                                <FormLabel fontSize="sm">Descripción</FormLabel>
                                <NumberInput min={0} value={mapping.descripcion} onChange={(_, v) => handleMappingChange('descripcion', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">Unidad de Medida</FormLabel>
                                <NumberInput min={0} value={mapping.unidadMedida} onChange={(_, v) => handleMappingChange('unidadMedida', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">Stock</FormLabel>
                                <NumberInput min={0} value={mapping.stock} onChange={(_, v) => handleMappingChange('stock', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">Producto ID</FormLabel>
                                <NumberInput min={0} value={mapping.productoId} onChange={(_, v) => handleMappingChange('productoId', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">IVA</FormLabel>
                                <NumberInput min={0} value={mapping.iva} onChange={(_, v) => handleMappingChange('iva', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">Punto de Reorden</FormLabel>
                                <NumberInput min={0} value={mapping.puntoReorden} onChange={(_, v) => handleMappingChange('puntoReorden', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">Costo Unitario</FormLabel>
                                <NumberInput min={0} value={mapping.costoUnitario} onChange={(_, v) => handleMappingChange('costoUnitario', v)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                        </SimpleGrid>
                    </Box>
                </Box>
            </VStack>
        </Container>
    );
}
