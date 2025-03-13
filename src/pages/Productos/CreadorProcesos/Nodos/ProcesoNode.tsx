

import {Box, Flex, Text, Icon, VStack, HStack} from "@chakra-ui/react";
import {Handle, Position, NodeProps} from "@xyflow/react";

import { TbArrowsJoin } from "react-icons/tb";

import { BiRename } from "react-icons/bi";
import { PiClockCountdownFill } from "react-icons/pi";

const handleStyle = {
    width:"0.8em",
    height:"0.8em",
}

export default function ProcesoNode(props: NodeProps) {

    const data = props.data;

    return (
        <Box
            border={"2px solid black"}
            boxShadow={props.selected ? "0 0 10px gold" : ""}
            transition="box-shadow 0.1s ease"
            _hover={props.selected ? { boxShadow: "0 0 10px gold" } : { boxShadow: "0 0 10px blue" }}
            w={"15em"}
        >

            <Flex
                //bgColor={"green.200"}
                direction={"column"}
                align={"center"}
            >

                <Box w={"full"} p={"0.5em"} flex={1} bgColor={"blue.400"}>
                    <Text fontWeight={"bold"}>
                        {String(data.label)}
                    </Text>
                </Box>

                <Icon mr={"1em"} ml={"1em"} as={TbArrowsJoin} w="4em" h="4em" color="tomato" />

                <Handle
                    type={"target"}
                    position={Position.Left}
                    id={"o1"}
                    style={handleStyle}
                    isConnectable={true}
                />

                <Handle
                    type={"source"}
                    position={Position.Right}
                    id={"i1"}
                    style={handleStyle}
                    isConnectable={true}
                />

                <VStack w={"full"} borderTop={"2px solid gray"} background={"gray.50"} pt={"1em"}>
                    {String(data.nombreProceso).trim() !== "" && (
                        <HStack w="full">
                            <Icon mr="1em" ml="1em" as={BiRename} w="2em" h="2em" color="teal" />
                            <Text fontWeight="bold">{String(data.nombreProceso)}</Text>
                        </HStack>
                    )}

                    {String(data.tiempo).trim() !== "" && (
                        <HStack w="full">
                            <Icon mr="1em" ml="1em" as={PiClockCountdownFill} w="2em" h="2em" color="teal" />
                            <Text fontWeight="bold">{String(data.tiempo)}</Text>
                            <Text fontWeight="bold"> { Number(data.unidadesTiempo) === 1 ? "Mins" : "Horas" }</Text>
                        </HStack>
                    )}
                </VStack>

                <Box
                    flex={1}
                    bgColor={"blue.400"}
                    w={"full"}
                >
                    <Text fontWeight={"bold"} > Proceso </Text>
                </Box>

            </Flex>
        </Box>
    )
}