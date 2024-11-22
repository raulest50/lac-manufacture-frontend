import {
    Accordion, AccordionButton, AccordionItem, AccordionPanel,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FormControl,
    Heading,
    HStack,
    List,
    ListItem, TabPanel, Text, VStack
} from "@chakra-ui/react";
import {OrdenProduccion} from "../../models/OrdenProduccion.tsx";
import {OrdenSeguimiento} from "../../models/OrdenSeguimiento.tsx";


export default function SeguimientoOrdenes(){


    return(
        <Flex direction={'column'}>
            <Heading>Ordenes de Produccion Pendientes</Heading>
            <Flex direction={'row'}>
                <FormControl>
                    <Button m={5} colorScheme={'teal'}
                            onClick={() => UpdateOrdenesActivas()}
                    >Actualizar</Button>
                </FormControl>
            </Flex>
            <List spacing={'0.5em'}>
                {listaOrdenesProdActiv.map((orden:OrdenProduccion) => (
                    <ListItem key={orden.ordenId} >
                        <Box>
                            <Card fontFamily={'Comfortaa Variable'} p={'0.7em'}
                                  sx={{
                                      borderRadius:'0',
                                      ':hover':{
                                          //bg:'teal.200',
                                      },
                                      borderLeft: "0.7em solid",
                                      borderColor: "red.300",
                                  }}
                            >
                                <CardHeader p={1} >
                                    <HStack justifyContent={'space-evenly'} >
                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Producto: {orden.terminado.nombre} </Heading>
                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Producto Id: {orden.terminado.productoId} </Heading>
                                        <Heading size={'sm'} fontFamily={'Anton'} fontSize={'1.2em'}> Orden Id: {orden.ordenId} </Heading>
                                    </HStack>
                                </CardHeader>
                                <CardBody p={1}>
                                    <Flex direction={'row'} p={'1em'} h={'full'} w={'full'}>
                                        <VStack flex={'3'} justifyContent={'space-evenly'} alignItems={'start'} pl={'1em'}>
                                            <Text>Unidad de Medida: {orden.terminado.tipoUnidades}</Text>
                                            <Text>Cantidad x Und: {orden.terminado.cantidadUnidad}</Text>
                                            <Text>Fecha Creacion Orden: {new Date(orden.fechaInicio).toLocaleString()}</Text>
                                            <Accordion allowToggle w={'full'}>
                                                <AccordionItem>
                                                    <AccordionButton>
                                                        <Box as='span' flex='1' textAlign='left'>
                                                            Ordenes de Seguimiento
                                                        </Box>
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4}>
                                                        <List spacing={'0.5em'}>
                                                            {orden.ordenesSeguimiento.map((seg:OrdenSeguimiento) => (
                                                                <Flex direction={'row'}>
                                                                    <VStack sx={{
                                                                        'borderLeft':'0.7em solid',
                                                                        'borderColor': seg.estado==0? 'red.300':'green.200',
                                                                    }}>
                                                                        <ListItem key={seg.seguimientoId} p={'0.2em'}>
                                                                            <Text> Id Orden Seguimiento: {seg.seguimientoId}</Text>
                                                                            <Text>{seg.insumo.producto.nombre}</Text>
                                                                            <Text> Tipo Producto {seg.insumo.producto.tipo_producto}</Text>
                                                                        </ListItem>
                                                                    </VStack>
                                                                </Flex>
                                                            ))}
                                                        </List>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            </Accordion>
                                        </VStack>
                                        <Text>Observaciones : {orden.observaciones} </Text>
                                    </Flex>
                                </CardBody>
                            </Card>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Flex>
    );
}