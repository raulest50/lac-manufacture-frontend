import { useState } from 'react';
import {
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Button,
    Textarea,
    useToast, Select,
} from "@chakra-ui/react";
import axios, { AxiosError } from 'axios';
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();

function RegistrarProveedor() {
    // State declarations for each field
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [contacto, setContacto] = useState(''); // This will be mapped to "nombreContacto"
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [url, setUrl] = useState('');
    const [observacion, setObservacion] = useState('');
    const [regimenTributario, setRegimenTributario] = useState(0);

    const toast = useToast();

    // Function to validate required fields
    const validarProveedor = () => {
        if (!id || !nombre) {
            toast({
                title: 'Campos obligatorios faltantes',
                description: 'Por favor, complete el NIT y el nombre del proveedor.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return false;
        }
        return true;
    };

    // Submit handler using axios and async/await
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarProveedor()) {
            return;
        }

        // Create the payload using the expected property names:
        // - Convert "id" to a number with parseInt
        // - Map "contacto" to "nombreContacto"
        const nuevoProveedor = {
            id: parseInt(id),
            nombre,
            direccion,
            regimen_tributario: regimenTributario,
            ciudad,
            departamento,
            nombreContacto: contacto,
            telefono,
            email,
            url,
            observacion,
        };

        try {
            const response = await axios.post(endPoints.save_proveedores, nuevoProveedor);
            console.log('Proveedor registrado exitosamente:', response.data);

            toast({
                title: 'Proveedor registrado',
                description: `El proveedor con NIT ${response.data.id} ha sido registrado exitosamente.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // Reset the form fields
            setId('');
            setNombre('');
            setDireccion('');
            setCiudad('');
            setDepartamento('');
            setContacto('');
            setTelefono('');
            setEmail('');
            setUrl('');
            setObservacion('');
        } catch (error) {
            const err = error as AxiosError;
            console.error('Error al registrar el proveedor:', error);
            if (err.response && err.response.status === 409) {
                // Handle error if the Nit already exists
                toast({
                    title: 'Error al registrar',
                    description: 'Ya existe un proveedor con el NIT proporcionado.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error al conectar con el servidor',
                    description: 'Por favor, intente nuevamente más tarde.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <VStack
                as="form"
                spacing={4}
                mt={4}
                onSubmit={handleSubmit}
                align="stretch"
            >
                <FormControl isRequired>
                    <FormLabel>Nit</FormLabel>
                    <Input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Nit o identificación del proveedor"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre del proveedor"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Dirección</FormLabel>
                    <Input
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Dirección del proveedor"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Regimen Tributario</FormLabel>
                    <Select
                        flex="1"
                        value={regimenTributario}
                        onChange={(e) => setRegimenTributario(Number(e.target.value))}
                    >
                        <option value={0}>{"Regimen Comun"}</option>
                        <option value={1}>{"Regimen Simplificado"}</option>
                        <option value={2}>{"Regimen Especial"}</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Ciudad</FormLabel>
                    <Input
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        placeholder="Ciudad"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Departamento</FormLabel>
                    <Input
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        placeholder="Departamento"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Contacto</FormLabel>
                    <Input
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Persona de contacto"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Teléfono</FormLabel>
                    <Input
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Número de teléfono"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>URL</FormLabel>
                    <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Página web"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Observaciones</FormLabel>
                    <Textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        placeholder="Notas adicionales"
                    />
                </FormControl>

                <Button type="submit" colorScheme="blue" alignSelf="flex-end">
                    Registrar Proveedor
                </Button>
            </VStack>
        </Container>
    );
}

export default RegistrarProveedor;
