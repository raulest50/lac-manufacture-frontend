// src/pages/Usuarios/ModuleSelectionDialog.tsx
import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Modulo } from '../../types/Modulo';

export type ModuleItem = {
    id: number;
    modulo: Modulo;
    displayName: string;
};

interface ModuleSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    availableModules: ModuleItem[];
    onModuleSelect: (module: ModuleItem) => void;
}

const ModuleSelectionDialog: React.FC<ModuleSelectionDialogProps> = ({
    isOpen,
    onClose,
    availableModules,
    onModuleSelect,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Seleccionar Módulo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <List spacing={3}>
                        {availableModules && availableModules.length > 0 ? (
                            availableModules.map((module) => (
                                <ListItem
                                    key={module.id}
                                    onClick={() => {
                                        onModuleSelect(module);
                                        onClose();
                                    }}
                                    _hover={{
                                        cursor: 'pointer',
                                        bg: 'gray.100',
                                    }}
                                    padding="2"
                                >
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    {module.displayName}
                                </ListItem>
                            ))
                        ) : (
                            <ListItem padding="2">
                                No hay módulos disponibles para asignar
                            </ListItem>
                        )}
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ModuleSelectionDialog;