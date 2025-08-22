import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

import { PiCubeFocusThin } from "react-icons/pi";

const handleStyle = {
  width: "1em",
  height: "1em",
};

export default function MaterialPrimarioNode(props: NodeProps) {
  const data = props.data;

  return (
    <Box
      border={"2px solid black"}
      transition="box-shadow 0.1s ease"
      _hover={{ boxShadow: "0 0 10px green" }}
      w={"12em"}
      p={"0.5em"}
      position="relative"
      textAlign="center"
    >
      <Flex direction={"column"} gap={1} align={"center"}>
        <Box bgColor={"green.300"} w={"full"} p={"0.3em"}>
          <Text fontWeight={"bold"}>{String(data.label)}</Text>
        </Box>

        <Icon w="3em" h="3em" color={"tomato"} as={PiCubeFocusThin} />

        <Text
          fontWeight={"bold"}
          borderTop={"2px solid black"}
          w={"full"}
          pt={"0.3em"}
        >
          {` ${data.cantidad} ${data.tipo_unidad}`}
        </Text>

        <Box bgColor={"green.300"} w={"full"} p={"0.3em"}>
          <Text fontWeight={"bold"}> Material Primario </Text>
        </Box>
      </Flex>

      <Handle
        type={"source"}
        position={Position.Right}
        id={"i1"}
        style={handleStyle}
        isConnectable={true}
      />
    </Box>
  );
}

