import { useState, useEffect } from 'react';
import {
    Card, 
    CardHeader, 
    CardBody, 
    Heading, 
    Text, 
    Flex, 
    Button, 
    IconButton, 
    FormControl, 
    FormLabel, 
    Input, 
    Box,
    Badge,
    useToast
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { ItemOrdenCompra, Lote, Movimiento, TipoMovimiento, Almacen } from '../../types.tsx';

interface LoteConCantidad extends Lote {
    cantidad: number;
}

interface Props {
    item: ItemOrdenCompra;
    onMovimientosChange: (movimientos: Movimiento[]) => void;
}

export function CardIngresoMaterial({ item, onMovimientosChange }: Props) {
    const toast = useToast();
    const [lotes, setLotes] = useState<LoteConCantidad[]>([
        {
            productionDate: '',
            expirationDate: '',
            cantidad: item.cantidad
        }
    ]);

    const MAX_LOTES = 3;

    // Actualizar los movimientos cuando cambian los lotes
    useEffect(() => {
        const movimientos: Movimiento[] = lotes
            .filter(lote => lote.cantidad > 0 && lote.productionDate && lote.expirationDate)
            .map(lote => ({
                cantidad: lote.cantidad,
                producto: item.material,
                tipoMovimiento: TipoMovimiento.COMPRA,
                almacen: Almacen.GENERAL,
                lote: {
                    productionDate: lote.productionDate,
                    expirationDate: lote.expirationDate
                },
                fechaMovimiento: new Date().toISOString()
            }));

        onMovimientosChange(movimientos);
    }, [lotes, item, onMovimientosChange]);

    const handleAddLote = () => {
        if (lotes.length >= MAX_LOTES) {
            toast({
                title: "Límite alcanzado",
                description: `No se pueden agregar más de ${MAX_LOTES} lotes por material.`,
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLotes([...lotes, {
            productionDate: '',
            expirationDate: '',
            cantidad: 0
        }]);
    };

    const handleRemoveLote = (index: number) => {
        if (lotes.length <= 1) {
            toast({
                title: "No se puede eliminar",
                description: "Debe haber al menos un lote por material.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const newLotes = [...lotes];
        newLotes.splice(index, 1);
        setLotes(newLotes);
    };

    const handleLoteChange = (index: number, field: keyof LoteConCantidad, value: string | number) => {
        const newLotes = [...lotes];
        newLotes[index] = {
            ...newLotes[index],
            [field]: value
        };
        setLotes(newLotes);
    };

    const totalCantidad = lotes.reduce((sum, lote) => sum + lote.cantidad, 0);
    const isValid = totalCantidad <= item.cantidad && totalCantidad > 0;

    return (
        <Card mb={4} variant="elevated" borderWidth={!isValid ? "2px" : "1px"} borderColor={!isValid ? "red.500" : "gray.200"}>
            <CardHeader bg="teal.50">
                <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                        <Heading size="md">{item.material.nombre}</Heading>
                        <Text>ID: {item.material.productoId}</Text>
                    </Box>
                    <Box>
                        <Badge colorScheme={isValid ? "green" : "red"}>
                            {totalCantidad} / {item.cantidad} {item.material.tipoUnidades}
                        </Badge>
                    </Box>
                </Flex>
            </CardHeader>

            <CardBody>
                <Text mb={4}>
                    Ingrese la información de los lotes para este material. Puede agregar hasta {MAX_LOTES} lotes.
                </Text>

                {lotes.map((lote, index) => (
                    <Box key={index} mb={4} p={3} borderWidth="1px" borderRadius="md">
                        <Flex justifyContent="space-between" alignItems="center" mb={2}>
                            <Heading size="sm">Lote #{index + 1}</Heading>
                            <IconButton
                                aria-label="Eliminar lote"
                                icon={<MinusIcon />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleRemoveLote(index)}
                            />
                        </Flex>

                        <FormControl mb={2}>
                            <FormLabel>Fecha de Fabricación</FormLabel>
                            <Input 
                                type="date" 
                                value={lote.productionDate}
                                onChange={(e) => handleLoteChange(index, 'productionDate', e.target.value)}
                            />
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Fecha de Vencimiento</FormLabel>
                            <Input 
                                type="date" 
                                value={lote.expirationDate}
                                onChange={(e) => handleLoteChange(index, 'expirationDate', e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Cantidad</FormLabel>
                            <Input 
                                type="number" 
                                value={lote.cantidad}
                                onChange={(e) => handleLoteChange(index, 'cantidad', parseInt(e.target.value) || 0)}
                                min={0}
                                max={item.cantidad}
                            />
                        </FormControl>
                    </Box>
                ))}

                <Button 
                    leftIcon={<AddIcon />} 
                    colorScheme="teal" 
                    variant="outline" 
                    onClick={handleAddLote}
                    isDisabled={lotes.length >= MAX_LOTES}
                    mt={2}
                >
                    Agregar Lote
                </Button>

                {!isValid && (
                    <Text color="red.500" mt={2}>
                        La suma de las cantidades debe ser mayor a 0 y no debe exceder {item.cantidad}.
                    </Text>
                )}
            </CardBody>
        </Card>
    );
}
