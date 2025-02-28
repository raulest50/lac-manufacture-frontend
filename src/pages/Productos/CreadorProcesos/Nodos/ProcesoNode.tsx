

import {Box, Flex, Text, Icon} from "@chakra-ui/react";
import {Handle, Position, NodeProps} from "@xyflow/react";

import { TbArrowsJoin } from "react-icons/tb";

const handleStyle = {
    width:"0.8em",
    height:"0.8em",
}

export default function ProcesoNode(props: NodeProps) {

    const data = props.data;

    return(
        <Box
            border={"2px solid black"}
            boxShadow={props.selected ? "0 0 10px gold" : ""}
            transition="box-shadow 0.1s ease"
            _hover={props.selected ? { boxShadow: "0 0 10px gold" } : { boxShadow: "0 0 10px blue" }}
            w={"15em"}
        >

            <Flex
                //bgColor={"green.200"}
                gap={2}
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