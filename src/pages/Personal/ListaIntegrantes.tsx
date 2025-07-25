import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box
} from '@chakra-ui/react';
import { IntegrantePersonal, getEstadoIntegranteText } from './types';

interface Props {
    integrantes: IntegrantePersonal[];
}

const ListaIntegrantes: React.FC<Props> = ({ integrantes }) => {
    return (
        <Box overflowX="auto" mt={4}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Nombres</Th>
                        <Th>Apellidos</Th>
                        <Th>Departamento</Th>
                        <Th>Estado</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {integrantes.map((intg) => (
                        <Tr key={intg.id}>
                            <Td>{intg.id}</Td>
                            <Td>{intg.nombres}</Td>
                            <Td>{intg.apellidos}</Td>
                            <Td>{intg.departamento ?? '-'}</Td>
                            <Td>{getEstadoIntegranteText(intg.estado)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ListaIntegrantes;
