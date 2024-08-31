

import {
    Button, Input, Flex, HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from "@chakra-ui/react";
  
  import {useState, useEffect} from "react";
  
  interface ModalConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  
  export default function ModalConfirmation({ isOpen, onClose }:ModalConfirmationProps) {
      
      
      const [confirmationNumber, setConfirmationNumber] = useState("");
      const [randomNum, setRandomNum] = useState(0);
      
      useEffect( () => {
        setRandomNum(Math.floor(10 + Math.random() * 90));
      }, [isOpen]);
      
      const onClickConfirmar = () => {
        if(Number(confirmationNumber) === randomNum){
          onClose();
          setConfirmationNumber("");
        } 
      };
      
      const closeWindow = () => {
        onClose();
        setConfirmationNumber("");
      }
    
      return (
        <>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader> Ventana de Confirmacion</ModalHeader>
              <ModalCloseButton />
              <ModalBody p={'1em'}>
                <Flex direction={'column'} gap={'1em'}>
                  <p>Para confirmar que esta seguro de hacer esta accion digite porfavor este numero: {randomNum}  y seleccione aceptar</p>
                  <Input
                    value={confirmationNumber}
                    onChange={ (e) => setConfirmationNumber(e.target.value)}
                  />
                </Flex>
                
              </ModalBody>
    
              <ModalFooter>
                <HStack>
                  <Button colorScheme="blue" mr={3} onClick={closeWindow}>
                    Cancelar
                  </Button>
                  <Button variant="solid" colorScheme="orange"
                          onClick={onClickConfirmar}
                  > Confirmar
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    }
    
    
    