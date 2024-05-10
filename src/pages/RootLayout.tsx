
import {Outlet} from 'react-router-dom'
import {Flex, Heading} from '@chakra-ui/react'


function RootLayout(){
    return(
        <Flex direction={'column'}>
            <Outlet/>
        </Flex>
    );
}

export default RootLayout