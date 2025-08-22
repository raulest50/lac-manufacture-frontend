import {Box, Container, Flex, Text, Heading, Alert, AlertIcon, AlertTitle, AlertDescription} from '@chakra-ui/react';

export function AsistenteDispensacionDirecta() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <Flex direction='column' gap={4} align="center" justify="center" py={10}>
                <Heading size="lg" color="teal.600">Dispensación Directa</Heading>
                <Alert 
                    status="info" 
                    variant="subtle" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    textAlign="center" 
                    borderRadius="md"
                    p={6}
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Módulo en Desarrollo
                    </AlertTitle>
                    <AlertDescription maxWidth="md">
                        Esta funcionalidad se encuentra actualmente en desarrollo. 
                        Pronto estará disponible la dispensación directa de materiales.
                    </AlertDescription>
                </Alert>
            </Flex>
        </Container>
    );
}