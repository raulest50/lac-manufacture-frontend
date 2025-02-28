import {Handle, NodeProps, Position} from "@xyflow/react";
import {Box, Flex, Text, Icon } from "@chakra-ui/react";

import { PiCubeFocusThin } from "react-icons/pi";

const handleStyle = {
    width:"0.8em",
    height:"0.8em",
}


export default function MaterialPrimarioNode(props: NodeProps) {

    const data = props.data;

    return(
        <Box
            border={"2px solid black"}
            transition="box-shadow 0.1s ease"
            _hover={{ boxShadow: "0 0 10px green" }}
            w={"15em"}
        >
            <Flex
                direction={"column"}
                gap={2}
                align={"center"}
            >
                <Box
                    flex={1}
                    bgColor={"green.300"}
                    w={"full"}
                    p={"0.5em"}
                >
                    <Text fontWeight={"bold"}>
                        {String(data.label)}
                    </Text>
                </Box>

                <Icon w="4em" h="4em" color={"tomato"} as={PiCubeFocusThin} />

                <Box  w={"1em"} h={"1em"} flex={5}>
                    <Handle
                        type={"source"}
                        position={Position.Right}
                        id={"i1"}
                        style={handleStyle}
                        isConnectable={true}
                    />
                </Box>

                <Box
                    flex={1}
                    w={"full"}
                    borderTop={"2px solid black"}
                    pt={"0.5em"}
                >
                    <Text fontWeight={"bold"}>
                        {` ${data.cantidad} ${data.tipo_unidad}`}
                    </Text>
                </Box>

                <Box
                    flex={1}
                    bgColor={"green.300"}
                    w={"full"}
                >
                    <Text fontWeight={"bold"}> Material Primario </Text>
                </Box>
            </Flex>
        </Box>
    )
}