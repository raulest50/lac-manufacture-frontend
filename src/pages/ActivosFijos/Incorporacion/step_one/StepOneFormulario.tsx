import { useState } from 'react';
import { 
  Button, 
  Flex, 
  Card, 
  CardHeader, 
  CardBody, 
  Heading, 
  Icon, 
  Text, 
  SimpleGrid 
} from '@chakra-ui/react';
import { FaFileInvoiceDollar } from 'react-icons/fa'; // Icon for "con OC"
import { FaFileAlt } from 'react-icons/fa'; // Icon for "sin OC"
import { IncorporacionActivoDta } from '../../types.tsx';

type Props = {
    setActiveStep: (step: number) => void;
    setIncorporacionActivoHeader: (incorporacionActivoHeader: IncorporacionActivoDta) => void;
};

export function StepOneFormulario({ setActiveStep, setIncorporacionActivoHeader }: Props) {
  // Declare functions for handling card clicks
  const handleConOCClick = () => {
    console.log("Incorporacion con OC seleccionada");
    // Update the incorporacionActivoHeader with the selected type
    setIncorporacionActivoHeader({ tipoIncorporacion: 'CON_OC' });
    setActiveStep(2);
  };

  const handleSinOCClick = () => {
    console.log("Incorporacion sin OC seleccionada");
    // Update the incorporacionActivoHeader with the selected type
    setIncorporacionActivoHeader({ tipoIncorporacion: 'SIN_OC' });
    setActiveStep(2);
  };

  return (
    <Flex direction="column" gap={10} w="full">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Seleccione el tipo de incorporación
      </Heading>

      <SimpleGrid columns={2} spacing={8} w="full">
        {/* Card for "Incorporacion con OC" */}
        <Card 
          h="250px"
          cursor="pointer"
          bg="blue.100"
          _hover={{ 
            bg: "blue.300",
            transform: "translateY(-5px)",
            boxShadow: "xl"
          }}
          _active={{ bg: "blue.800", color: "white" }}
          transition="all 0.3s ease"
          onClick={handleConOCClick}
        >
          <CardHeader borderBottom="0.1em solid" p={4}>
            <Heading as="h3" size="md" fontFamily="Comfortaa Variable">
              Incorporación con OC
            </Heading>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
            <Icon as={FaFileInvoiceDollar} boxSize="5em" mb={4} />
            <Text textAlign="center">
              Incorporar activo fijo con orden de compra existente
            </Text>
          </CardBody>
        </Card>

        {/* Card for "Incorporacion sin OC" */}
        <Card 
          h="250px"
          cursor="pointer"
          bg="green.100"
          _hover={{ 
            bg: "green.300",
            transform: "translateY(-5px)",
            boxShadow: "xl"
          }}
          _active={{ bg: "green.800", color: "white" }}
          transition="all 0.3s ease"
          onClick={handleSinOCClick}
        >
          <CardHeader borderBottom="0.1em solid" p={4}>
            <Heading as="h3" size="md" fontFamily="Comfortaa Variable">
              Incorporación sin OC
            </Heading>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
            <Icon as={FaFileAlt} boxSize="5em" mb={4} />
            <Text textAlign="center">
              Incorporar activo fijo sin orden de compra
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Flex justifyContent="space-between" mt={6}>
        <Button onClick={() => setActiveStep(0)}>
          Atrás
        </Button>
      </Flex>
    </Flex>
  );
}
