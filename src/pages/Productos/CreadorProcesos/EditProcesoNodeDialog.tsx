import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ProcesoNodeData } from "./types"; // adjust the import path as needed

interface EditProcesoNodeDialogProps<T extends ProcesoNodeData> {
    isOpen: boolean;
    onClose: () => void;
    nodeData: T;
    onSave: (newData: T) => void;
}

export default function EditProcesoNodeDialog<T extends ProcesoNodeData>({
                                                                             isOpen,
                                                                             onClose,
                                                                             nodeData,
                                                                             onSave,
                                                                         }: EditProcesoNodeDialogProps<T>) {
    // Maintain a local copy of the node data
    const [localData, setLocalData] = useState<T>(nodeData);

    useEffect(() => {
        setLocalData(nodeData);
    }, [nodeData]);

    const handleSave = () => {
        onSave(localData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Process Node</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Label</FormLabel>
                        <Input
                            value={localData.label}
                            onChange={(e) =>
                                setLocalData({ ...localData, label: e.target.value })
                            }
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Tiempo</FormLabel>
                        <Input
                            value={localData.tiempo ?? ""}
                            onChange={(e) =>
                                setLocalData({ ...localData, tiempo: e.target.value })
                            }
                            placeholder="Enter time"
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Instrucciones</FormLabel>
                        <Textarea
                            value={localData.instrucciones ?? ""}
                            onChange={(e) =>
                                setLocalData({ ...localData, instrucciones: e.target.value })
                            }
                            placeholder="Enter instructions"
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Nombre Proceso</FormLabel>
                        <Input
                            value={localData.nombreProceso ?? ""}
                            onChange={(e) =>
                                setLocalData({ ...localData, nombreProceso: e.target.value })
                            }
                            placeholder="Enter process name"
                        />
                    </FormControl>
                    {/* Add more fields if needed */}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
