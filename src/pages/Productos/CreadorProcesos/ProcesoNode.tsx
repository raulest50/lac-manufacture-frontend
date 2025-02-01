

import {Box, Flex, Text, Icon} from "@chakra-ui/react";
import {Handle, Position, NodeProps} from "@xyflow/react";

import { TbTransform } from "react-icons/tb";

const handleStyle = {
    color:"green",
}

export default function ProcesoNode(props: NodeProps) {

    const data = props.data;

    return(
        <Box border={"1px solid black"} justifyContent={"center"} alignContent={"center"}>

            <Flex bgColor={"green.200"} gap={2} direction={"column"}>

                <Box p={"0.5em"} flex={1} bgColor={"blue.400"}>
                    <Text>
                        {String(data.label)}
                    </Text>
                </Box>

                <Icon fontSize={"3em"} color={"tomato"} >
                    <TbTransform/>
                </Icon>

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

                <Box flex={1} bgColor={"blue.400"}>
                    <Text> - </Text>
                </Box>

            </Flex>
        </Box>
    )
}