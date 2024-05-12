
import {IoArrowBack} from "react-icons/io5";
import {Flex, Spacer, Heading, IconButton} from '@chakra-ui/react'
import {NavLink} from "react-router-dom";



interface MyHeaderProps{
    title:string,
}

function MyHeader({title,}:MyHeaderProps){
    return(
        <Flex pb={'0.2em'} direction={'row'} mb={'1em'} borderBottom={'0.04em solid'} align={'center'}>
            <NavLink to={'/'}>
                <IconButton
                    ml={'1em'} mr={'2em'} my={'0.2em'}
                    flex={1} colorScheme={'teal'}
                    aria-label='back' fontSize={'3xl'} boxSize={'2em'} icon={<IoArrowBack/>}/>
            </NavLink>
            <Heading flex={2} as={'h2'} size={'xl'} fontFamily={'Comfortaa Variable'}>{title}</Heading>
            <Spacer flex={2}/>
        </Flex>
    )
}

export default MyHeader;