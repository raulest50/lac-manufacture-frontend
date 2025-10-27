import {Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react';
import {FaArrowLeft} from 'react-icons/fa';
import DefinicionProcesosTab from './DefinicionProcesosTab.tsx';
import CrearRecursoProduccion from './CrearRecursoProduccion.tsx';
import ConsultaRecursosProduccion from './ConsultaRecursosProduccion.tsx';
import CrearAreaProduccionTab from './CreadorProcesos/CrearAreaProduccionTab.tsx';
import {my_style_tab} from '../../../styles/styles_general.tsx';

interface Props {
    onBack: () => void;
}

export function DefinicionProcesosTabs({onBack}: Props) {
    return (
        <Flex direction={'column'} gap={4} w="full" h="full">
            <Button leftIcon={<FaArrowLeft />} w="fit-content" onClick={onBack}>
                Volver
            </Button>
            <Tabs isFitted gap="1em" variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Definición de Procesos</Tab>
                    <Tab sx={my_style_tab}>Crear Recurso Producción</Tab>
                    <Tab sx={my_style_tab}>Consulta Recursos Producción</Tab>
                    <Tab sx={my_style_tab}>Crear Área Producción</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <DefinicionProcesosTab />
                    </TabPanel>
                    <TabPanel>
                        <CrearRecursoProduccion />
                    </TabPanel>
                    <TabPanel>
                        <ConsultaRecursosProduccion />
                    </TabPanel>
                    <TabPanel>
                        <CrearAreaProduccionTab />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

export default DefinicionProcesosTabs;
