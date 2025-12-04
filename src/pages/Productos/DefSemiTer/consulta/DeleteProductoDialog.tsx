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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface DeleteProductoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<boolean | void> | boolean | void;
}

export default function DeleteProductoDialog({ isOpen, onClose, onConfirm }: DeleteProductoDialogProps) {
    const [randomCode, setRandomCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setIsLoading(false);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            setRandomCode(Math.floor(1000 + Math.random() * 9000).toString());
            setInputCode('');
        } else {
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const shouldClose = await onConfirm();
            if (shouldClose !== false) {
                handleClose();
                return;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar Eliminación</ModalHeader>
                <ModalBody>
                    <Text mb={4}>
                        Para confirmar la eliminación del producto, ingrese el siguiente código:
                    </Text>
                    <Text fontWeight="bold" mb={4}>Código: {randomCode}</Text>
                    <Input
                        placeholder="Ingrese el código aquí"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        isDisabled={isLoading}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="red"
                        mr={3}
                        onClick={handleConfirm}
                        isDisabled={inputCode !== randomCode || isLoading}
                        isLoading={isLoading}
                    >
                        Eliminar
                    </Button>
                    <Button variant="ghost" onClick={handleClose} isDisabled={isLoading}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

