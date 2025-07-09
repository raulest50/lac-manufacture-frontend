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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { PositionNodeData } from "../types";

interface EditPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  positionData: PositionNodeData;
  onSave: (newData: PositionNodeData) => void;
}

export default function EditPositionDialog({
  isOpen,
  onClose,
  positionData,
  onSave,
}: EditPositionDialogProps) {
  const [localData, setLocalData] = useState<PositionNodeData>(positionData);

  useEffect(() => {
    setLocalData(positionData);
  }, [positionData]);

  const handleSave = () => {
    onSave(localData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Cargo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Título del Cargo</FormLabel>
            <Input
              value={localData.title}
              onChange={(e) =>
                setLocalData({ ...localData, title: e.target.value })
              }
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Departamento</FormLabel>
            <Input
              value={localData.department}
              onChange={(e) =>
                setLocalData({ ...localData, department: e.target.value })
              }
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              value={localData.description}
              onChange={(e) =>
                setLocalData({ ...localData, description: e.target.value })
              }
              placeholder="Descripción breve del cargo"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Nivel Jerárquico</FormLabel>
            <NumberInput
              min={1}
              max={10}
              value={localData.level}
              onChange={(valueString) =>
                setLocalData({ ...localData, level: parseInt(valueString) })
              }
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
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}