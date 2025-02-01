
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    List,
    ListItem,
    Text,

} from '@chakra-ui/react';

interface ItemCompra {
    itemCompraId: number;
    materiaPrima: {
        nombre: string;
    };
    cantidad: number;
    precioCompra: number;
}

interface CompraItemsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    itemsCompra: ItemCompra[];
}

function CompraItemsDialog({ isOpen, onClose, itemsCompra }: CompraItemsDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Items de la Compra</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <List spacing={3}>
                        {itemsCompra.map((item) => (
                            <ListItem key={item.itemCompraId}>
                                <Text>
                                    <strong>Materia Prima:</strong> {item.materiaPrima.nombre}
                                </Text>
                                <Text>
                                    <strong>Cantidad:</strong> {item.cantidad}
                                </Text>
                                <Text>
                                    <strong>Precio de Compra:</strong> {item.precioCompra}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CompraItemsDialog;
