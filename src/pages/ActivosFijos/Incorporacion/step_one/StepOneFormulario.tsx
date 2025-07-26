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



    return (
        <Flex direction="column" gap={10} w="full">
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
                Seleccione el tipo de incorporación
            </Heading>

            <SimpleGrid columns={2} spacing={8} w="full">

            </SimpleGrid>
        </Flex>
    );
}
