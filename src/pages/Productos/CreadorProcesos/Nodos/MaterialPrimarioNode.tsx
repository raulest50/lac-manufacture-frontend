import {Handle, NodeProps, Position} from "@xyflow/react";
import {Box, Flex, Text, Icon} from "@chakra-ui/react";

import { FaDashcube } from "react-icons/fa";

const handleStyle = {
    color:"green",
}


export default function MaterialPrimarioNode(props: NodeProps) {

    const data = props.data;

    return(
        <Box border={"1px solid black"}>
            <Flex direction={"column"}>
                <Box flex={1} bgColor={"green.300"}>
                    <Text>
                        {String(data.label)}
                    </Text>
                </Box>

                <Box bgColor={"green.200"} w={"1em"} h={"1em"} flex={5}>
                    <Handle
                        type={"source"}
                        position={Position.Right}
                        id={"i1"}
                        style={handleStyle}
                        isConnectable={true}
                    />
                    <Icon fontSize={"3em"} color={"tomato"} >
                        <FaDashcube />
                    </Icon>
                </Box>

                <Box flex={1} bgColor={"green.300"}>
                </Box>
            </Flex>
        </Box>
    )
}