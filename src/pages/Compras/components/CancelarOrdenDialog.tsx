// src/components/CancelarOrdenDialog.tsx
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Input,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import EndPointsURL from '../../../api/EndPointsURL.tsx';
import { OrdenCompraMateriales } from '../types.tsx';

interface CancelarOrdenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompraMateriales;
    onOrderCancelled?: () => void;
}

const CancelarOrdenDialog: React.FC<CancelarOrdenDialogProps> = ({ isOpen, onClose, orden, onOrderCancelled }) => {
    const [randomCode, setRandomCode] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const toast = useToast();


    useEffect(() => {
        if (isOpen) {
            // Generate a random 7-digit number as a string.
            const code = Math.floor(1000000 + Math.random() * 9000000).toString();
            setRandomCode(code);
            setInputCode('');
        }
    }, [isOpen]);

    const handleAnularOrden = async () => {
        if (inputCode === randomCode) {
            try {
                // Call the backend endpoint to cancel the order.
                await axios.put(`${EndPointsURL.getDomain()}/compras/orden_compra/${orden.ordenCompraId}/cancel`);
                toast({
                    title: "Orden cancelada",
                    description: "La orden ha sido cancelada exitosamente.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                if (onOrderCancelled) {
                    onOrderCancelled();
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "No se pudo cancelar la orden. Inténtelo de nuevo.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Código incorrecto",
                description: "El código ingresado no coincide. La orden no fue cancelada.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar Cancelación de Orden de Compra</ModalHeader>
                <ModalBody>
                    <Text mb={4}>
                        Para confirmar la cancelación de la orden de compra, digite los 7 dígitos que ve en pantalla y de click en "Anular Orden de Compra".
                    </Text>
                    <Text fontWeight="bold" mb={4}>Código: {randomCode}</Text>
                    <Input
                        placeholder="Ingrese el código aquí"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={handleAnularOrden}>
                        Anular Orden
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Atrás</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CancelarOrdenDialog;
