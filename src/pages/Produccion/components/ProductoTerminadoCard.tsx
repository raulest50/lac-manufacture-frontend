import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    HStack,
    IconButton,
    Tag,
    Text,
    VStack,
    Heading,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { ProductoWithInsumos } from '../types';

interface ProductoTerminadoCardProps {
    selectedProducto: ProductoWithInsumos | null;
    onPickClick: () => void;
}

const ProductoTerminadoCard = ({
    selectedProducto,
    onPickClick,
}: ProductoTerminadoCardProps) => {
    const topInsumos = selectedProducto?.insumos.slice(0, 3) ?? [];

    return (
        <Card>
            <CardHeader>
                <HStack justify="space-between" align="flex-start">
                    <VStack align="flex-start" spacing={1}>
                        <Heading size="md">
                            {selectedProducto
                                ? selectedProducto.producto.nombre
                                : 'Seleccionar terminado/semiterminado'}
                        </Heading>
                        <Text fontSize="sm" color="gray.500">
                            {selectedProducto
                                ? `Código: ${selectedProducto.producto.productoId}`
                                : 'Elige un producto terminado o semiterminado para crear la orden.'}
                        </Text>
                    </VStack>
                    {selectedProducto ? (
                        <IconButton
                            aria-label="Cambiar producto"
                            icon={<SearchIcon />}
                            variant="ghost"
                            colorScheme="blue"
                            onClick={onPickClick}
                        />
                    ) : (
                        <IconButton
                            aria-label="Seleccionar producto"
                            icon={<SearchIcon />}
                            variant="outline"
                            colorScheme="blue"
                            onClick={onPickClick}
                        />
                    )}
                </HStack>
            </CardHeader>
            <CardBody>
                {selectedProducto ? (
                    <VStack align="stretch" spacing={4}>
                        <HStack spacing={2}>
                            <Tag colorScheme="purple">{selectedProducto.producto.tipo_producto}</Tag>
                            <Tag colorScheme="blue">
                                {selectedProducto.producto.cantidadUnidad}{' '}
                                {selectedProducto.producto.tipoUnidades}
                            </Tag>
                        </HStack>
                        <VStack align="stretch" spacing={3}>
                            <Heading size="sm">Insumos destacados</Heading>
                            {topInsumos.length === 0 ? (
                                <Text fontSize="sm" color="gray.500">
                                    Este producto no tiene insumos asociados.
                                </Text>
                            ) : (
                                topInsumos.map((insumo) => {
                                    const tieneStockSuficiente = insumo.stockActual >= insumo.cantidadRequerida;
                                    return (
                                        <HStack
                                            key={`${insumo.insumoId}-${insumo.productoId}`}
                                            justify="space-between"
                                            align="flex-start"
                                        >
                                            <VStack align="flex-start" spacing={0}>
                                                <Text fontWeight="medium">{insumo.productoNombre}</Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    Requerido: {insumo.cantidadRequerida}
                                                </Text>
                                            </VStack>
                                            <Badge colorScheme={tieneStockSuficiente ? 'green' : 'red'}>
                                                Stock: {insumo.stockActual}
                                            </Badge>
                                        </HStack>
                                    );
                                })
                            )}
                            {selectedProducto.insumos.length > 3 && (
                                <Text fontSize="xs" color="gray.500">
                                    +{selectedProducto.insumos.length - 3} insumos adicionales
                                </Text>
                            )}
                        </VStack>
                    </VStack>
                ) : (
                    <VStack align="stretch" spacing={4}>
                        <Text color="gray.600">
                            No hay un producto seleccionado actualmente. Usa el buscador para elegir el terminado o semiterminado adecuado.
                        </Text>
                        <Button leftIcon={<SearchIcon />} colorScheme="blue" onClick={onPickClick} alignSelf="flex-start">
                            Buscar producto
                        </Button>
                    </VStack>
                )}
            </CardBody>
        </Card>
    );
};

export default ProductoTerminadoCard;
