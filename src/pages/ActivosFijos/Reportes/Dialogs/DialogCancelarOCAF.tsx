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
import EndPointsURL from '../../../../api/EndPointsURL';
import { OrdenCompraActivo } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    orden: OrdenCompraActivo;
    onOrdenCancelada?: () => void;
}

const DialogCancelarOCAF: React.FC<Props> = ({ isOpen, onClose, orden, onOrdenCancelada }) => {
    const [randomCode, setRandomCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const toast = useToast();
    const endpoints = new EndPointsURL();

    useEffect(() => {
        if (isOpen) {
            const code = Math.floor(1000000 + Math.random() * 9000000).toString();
            setRandomCode(code);
            setInputCode('');
        }
    }, [isOpen]);

    const handleCancelar = async () => {
        if (inputCode !== randomCode) {
            toast({
                title: 'Código incorrecto',
                description: 'El código ingresado no coincide.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            await axios.put(
                endpoints.cancel_orden_compra_activo.replace('{ordenCompraActivoId}', String(orden.ordenCompraActivoId))
            );
            toast({
                title: 'Orden cancelada',
                description: 'La orden de compra fue cancelada correctamente.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            if (onOrdenCancelada) onOrdenCancelada();
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'No se pudo cancelar la orden.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar Cancelación</ModalHeader>
                <ModalBody>
                    <Text mb={4}>
                        Para confirmar la cancelación de la orden de compra, digite los 7 dígitos que ve a continuación y presione &quot;Cancelar Orden&quot;.
                    </Text>
                    <Text fontWeight="bold" mb={4}>Código: {randomCode}</Text>
                    <Input
                        placeholder="Ingrese el código"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleCancelar}>
                        Cancelar Orden
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Atrás</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DialogCancelarOCAF;
