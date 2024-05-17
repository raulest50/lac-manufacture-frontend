
//import {useState} from 'react'
import MyHeader from '../../components/MyHeader.tsx'
import {TextField, NumField} from '../../components/InputFields.tsx'

//import {MdDriveFolderUpload} from "react-icons/md";

import {
    Container, Flex, Spacer,
    Tab, TabList, Tabs, TabPanels, TabPanel,
    Text, Button,
    //Select,
    //RadioGroup, Radio,
    SimpleGrid, GridItem,
} from '@chakra-ui/react'

const my_style_tab={
    borderRadius:0,
//    border:0,
    ':active':{
        bg:'blue.200',
    },
    ':selected':{
        bg:'blue.200',
    },
}

function CrearProducto(){
    return(
        
        <Container maxW={'90wv'}>
            <MyHeader title={'Codificar Producto'}/>
            <Tabs isFitted gap={'1em'} variant="line">
                <TabList>
                    <Tab sx={my_style_tab}>Crear Materia Prima</Tab>
                    <Tab sx={my_style_tab}>Crear Terminado/Semiterminado</Tab>
                    {/*<Tab sx={my_style_tab}>Finalizar</Tab>*/}
                </TabList>
                
                <TabPanels>
                    <TabPanel >
                        <DefinirTipoTab/>
                    </TabPanel>
                    <TabPanel>
                        <Text>intermedio</Text>
                    </TabPanel>
                    {/*<TabPanel>*/}
                    {/*    <Text>finalizar</Text>*/}
                    {/*</TabPanel>*/}
                </TabPanels>
            </Tabs>
        </Container>
        
    );
}


function DefinirTipoTab(){
    
    //const p_tipos: string[] = ['materia prima', 'semi terminado', 'producto final']; // tipos de producto
    //const [sel_pt, set_sel_pt] = useState(p_tipos[0])
    
    return(
        
        <>
        {/*<RadioGroup onChange={set_sel_pt} value={sel_pt} m={'0.2em'} p={'0.2em'}>*/}
        {/*    <HStack>*/}
        {/*        <Radio p={'0.3em'} value={p_tipos[0]}>{p_tipos[0]}</Radio>*/}
        {/*        <Radio p={'0.3em'} value={p_tipos[1]}>{p_tipos[1]}</Radio>*/}
        {/*        <Radio p={'0.3em'} value={p_tipos[2]}>{p_tipos[2]}</Radio>*/}
        {/*    </HStack>*/}
        {/*</RadioGroup>*/}
        <SimpleGrid columns={3}>
            <TextField label={'Codigo'} left_elem={'id'} />
            <GridItem colSpan={2}>
                <TextField label={'Descripcion'} left_elem={'abc'} />
            </GridItem>
            <NumField label={'Costo($)'}/>

        </SimpleGrid>

        <Flex pt={'2em'}>
            <Spacer flex={4}/>
            <Button flex={1} colorScheme={'blue'}>Siguiente</Button>
        </Flex>
        </>
        
    )
}

export default CrearProducto;