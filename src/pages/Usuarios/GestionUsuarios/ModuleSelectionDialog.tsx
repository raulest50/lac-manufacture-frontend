// src/pages/Usuarios/ModuleSelectionDialog.tsx
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    List,
    ListItem,
    ListIcon, 
    FormControl, 
    FormLabel, 
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
    Flex,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import {Modulo} from "./types.tsx";
//import { Modulo } from '../../types/Modulo';

export type ModuleItem = {
    id: number;
    modulo: Modulo;
    nivelAcceso?: number;
    displayName: string;
};

interface ModuleSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    availableModules: ModuleItem[];
    onModuleSelect: (module: ModuleItem) => void;
    isDisabled?: boolean;
}

const ModuleSelectionDialog: React.FC<ModuleSelectionDialogProps> = ({
    isOpen,
    onClose,
    availableModules,
    onModuleSelect,
    isDisabled = false,
}) => {
    const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
    const [accessLevel, setAccessLevel] = useState<number>(1);
    const [isValidLevel, setIsValidLevel] = useState<boolean>(true);

    const handleModuleClick = (module: ModuleItem) => {
        setSelectedModule(module);
    };

    const handleLevelChange = (valueAsString: string, valueAsNumber: number) => {
        setAccessLevel(valueAsNumber);
        setIsValidLevel(valueAsNumber >= 1 && Number.isInteger(valueAsNumber));
    };

    const handleAssign = () => {
        if (selectedModule && isValidLevel) {
            const moduleWithLevel = {
                ...selectedModule,
                nivelAcceso: accessLevel
            };
            onModuleSelect(moduleWithLevel);
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setSelectedModule(null);
        setAccessLevel(1);
        setIsValidLevel(true);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose}>
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
                                    onClick={() => !isDisabled && handleModuleClick(module)}
                                    _hover={{
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        bg: isDisabled ? 'inherit' : 'gray.100',
                                    }}
                                    padding="2"
                                    bg={selectedModule?.id === module.id ? 'blue.100' : 'inherit'}
                                    opacity={isDisabled ? 0.6 : 1}
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
                    <FormControl mt={4}>
                        <FormLabel>Nivel de Acceso</FormLabel>
                        <NumberInput 
                            min={1} 
                            value={accessLevel} 
                            onChange={handleLevelChange}
                            precision={0}
                            isDisabled={isDisabled}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Flex width="100%" justifyContent="space-between">
                        <Button 
                            colorScheme="gray" 
                            onClick={resetAndClose}
                            isDisabled={isDisabled}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            colorScheme="blue" 
                            onClick={handleAssign}
                            isDisabled={!selectedModule || !isValidLevel || isDisabled}
                        >
                            Asignar
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModuleSelectionDialog;
