import {
  Flex, 
  Card, 
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Button,
  InputGroup,
  InputRightElement,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';

type Props = {
    ocNumber: string;
    setOcNumber: (value: string) => void;
    isSearching: boolean;
    onBack: () => void;
    onSearch: () => void;
};

/**
 * Panel para buscar órdenes de compra para activos fijos (OC-AF)
 */
export function PanelBusquedaOCFA({
    ocNumber,
    setOcNumber,
    isSearching,
    onBack,
    onSearch
}: Props) {
    return (
        <Flex direction="column" gap={8} alignItems="center" w="full" py={4}>
            <Heading as="h2" size="lg" textAlign="center" mb={4} color="gray.800" fontWeight="bold">
                Buscar Orden de Compra
            </Heading>
            <Flex direction="row" gap={5} alignItems="start" w="full" maxW="800px" mx="auto">
                <IconButton
                    aria-label="Volver"
                    icon={<ArrowBackIcon/>}
                    onClick={onBack}
                    size="lg"
                    color="gray.600"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="sm"
                    _hover={{ bg: "gray.50", color: "blue.600" }}
                />

                <Card 
                    flex={1} 
                    boxShadow="sm" 
                    borderRadius="md" 
                    overflow="hidden"
                    transition="all 0.2s ease"
                    _hover={{ boxShadow: "md" }}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <CardHeader 
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        color="teal.700"
                        py={5} 
                        px={6}
                        fontWeight="semibold"
                        fontSize="lg"
                        bg="gray.50"
                    >
                        Buscar OC-AF por ID
                    </CardHeader>

                    <CardBody p={8}>
                        <Text mb={5} color="gray.600" fontSize="md" lineHeight="1.6">
                            Ingrese el número de la orden de compra para activos fijos que desea incorporar al sistema.
                        </Text>

                        <FormControl mb={8}>
                            <FormLabel fontWeight="medium" color="gray.700" fontSize="md" mb={2}>Número de OC-AF</FormLabel>
                            <InputGroup size="lg">
                                <Input 
                                    placeholder="Ej: 12345"
                                    value={ocNumber}
                                    onChange={(e) => setOcNumber(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onSearch();
                                        }
                                    }}
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    focusBorderColor="blue.500"
                                    _hover={{ borderColor: "gray.300" }}
                                    fontSize="md"
                                    py={6}
                                />
                                <InputRightElement width="4.5rem" h="full" pr={1}>
                                    <Button 
                                        h="2rem" 
                                        size="sm" 
                                        bg="blue.600"
                                        color="white"
                                        _hover={{ bg: "blue.700" }}
                                        _active={{ bg: "blue.800" }}
                                        onClick={onSearch}
                                        borderRadius="md"
                                    >
                                        <SearchIcon />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <Button
                            bg="blue.600"
                            color="white"
                            size="lg"
                            width="full"
                            onClick={onSearch}
                            isLoading={isSearching}
                            loadingText="Buscando..."
                            leftIcon={<SearchIcon />}
                            _hover={{ bg: "blue.700" }}
                            _active={{ bg: "blue.800" }}
                            borderRadius="md"
                            py={6}
                            fontWeight="medium"
                            boxShadow="sm"
                        >
                            Buscar Orden de Compra
                        </Button>
                    </CardBody>
                </Card>
            </Flex>
        </Flex>
    );
}
