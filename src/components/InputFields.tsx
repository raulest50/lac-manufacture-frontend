

import {
    InputGroup, InputLeftElement, Input, Text, HStack,
    NumberInput, NumberInputField,
}
from "@chakra-ui/react";

interface TextFieldProps{
    left_elem:string,
    label:string
}

function TextField({label, left_elem}:TextFieldProps){
    return(
        <>
        <HStack p={'0.5em'}>
            <Text>{label}</Text>
            <InputGroup>
                <InputLeftElement color={'gray.300'}>
                    {left_elem}
                </InputLeftElement>
                <Input/>
            </InputGroup>
        </HStack>
        </>
    )
    
}

interface NumFieldProps{
    label:string,
}

function NumField({label}:NumFieldProps){
    return(
        <>
        <HStack p={'0.5em'}>
            <Text>{label}</Text>
            <InputGroup >
                <NumberInput>
                    <NumberInputField/>
                </NumberInput>
            </InputGroup>
        </HStack>
        </>
    )
    
}

export {TextField, NumField};