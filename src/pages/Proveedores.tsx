import { useState } from 'react';
import {
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Button,
    Textarea,
    useToast,
} from "@chakra-ui/react";

import MyHeader from "../components/MyHeader";
import axios, { AxiosError } from 'axios';
import EndPointsURL from "../api/EndPointsURL.tsx";

const endPoints = new EndPointsURL();


function ProveedoresPage() {
    // Declaración de estados para cada campo
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [url, setUrl] = useState('');
    const [observacion, setObservacion] = useState('');

    const toast = useToast();

    // Función para manejar el envío del formulario



    // Función para validar los datos del proveedor
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
        // Puedes agregar más validaciones aquí según tus necesidades
        return true;
    };

    // Función mejorada usando axios y async/await
    const handleSubmit = async () => {

        if (!validarProveedor()) {
            return;
        }

        // Crear objeto con los datos del proveedor
        const nuevoProveedor = {
            id,
            nombre,
            direccion,
            ciudad,
            departamento,
            contacto,
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

            // Reiniciar campos del formulario
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
                // Manejo de error si el NIT ya existe
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
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Registrar Proveedor'} />

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
                        placeholder="Nit o identificacion del proveedor"
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

                <Button onClick={() => handleSubmit()} colorScheme="blue" alignSelf="flex-end">
                    Registrar Proveedor
                </Button>
            </VStack>
        </Container>
    );
}

export default ProveedoresPage;
