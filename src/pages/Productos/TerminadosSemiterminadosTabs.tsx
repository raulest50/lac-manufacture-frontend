import {useState} from 'react';
import {Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react';
import {FaArrowLeft} from 'react-icons/fa';
import CodificarSemioTermiTab from './CodificarSemioTermiTab/CodificarSemioTermiTab';
import {FamiliasTab} from './FamiliasTab';
import InformeProductosTab from './InformeProductosTab';
import {my_style_tab} from '../../styles/styles_general.tsx';

interface Props {
    user: string | null;
    productosAccessLevel: number;
    onBack: () => void;
}

export function TerminadosSemiterminadosTabs({user, productosAccessLevel, onBack}: Props) {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Flex direction={'column'} gap={4} w="full" h="full">
            <Button leftIcon={<FaArrowLeft />} w="fit-content" onClick={onBack}>
                Volver
            </Button>
            <Tabs isFitted gap="1em" variant="line" index={tabIndex} onChange={setTabIndex}>
                <TabList>
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <Tab sx={my_style_tab}>Codificar Terminado/Semiterminado</Tab>
                    )}
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <Tab sx={my_style_tab}>Familias</Tab>
                    )}
                    <Tab sx={my_style_tab}>Consulta</Tab>
                </TabList>

                <TabPanels>
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <TabPanel>
                            <CodificarSemioTermiTab isActive={tabIndex === 0} />
                        </TabPanel>
                    )}
                    {(user === 'master' || productosAccessLevel >= 2) && (
                        <TabPanel>
                            <FamiliasTab />
                        </TabPanel>
                    )}
                    <TabPanel>
                        <InformeProductosTab />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}

export default TerminadosSemiterminadosTabs;
