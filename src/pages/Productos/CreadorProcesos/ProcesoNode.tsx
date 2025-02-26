

import {Box, Flex, Text, Icon} from "@chakra-ui/react";
import {Handle, Position, NodeProps} from "@xyflow/react";

import { TbTransform } from "react-icons/tb";

const handleStyle = {
    width:"0.8em",
    height:"0.8em",
}

export default function ProcesoNode(props: NodeProps) {

    const data = props.data;

    return(
        <Box
            border={"2px solid black"}
            transition="box-shadow 0.1s ease"
            _hover={{ boxShadow: "0 0 5px blue" }}
        >

            <Flex
                bgColor={"green.200"}
                gap={2}
                direction={"column"}
                align={"center"}
            >

                <Box w={"full"} p={"0.5em"} flex={1} bgColor={"blue.400"}>
                    <Text>
                        {String(data.label)}
                    </Text>
                </Box>

                <Icon mr={"1em"} ml={"1em"} as={TbTransform} w="4em" h="4em" color="tomato" />

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

                <Box
                    flex={1}
                    bgColor={"blue.400"}
                    w={"full"}
                >
                    <Text> Proceso </Text>
                </Box>

            </Flex>
        </Box>
    )
}