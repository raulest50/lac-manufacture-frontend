import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, Flex, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import { FaUserTie } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { PositionNodeData } from "../types";

const handleStyle = {
  width: "0.8em",
  height: "0.8em",
};

export default function PositionNode(props: NodeProps<PositionNodeData>) {
  const data = props.data;

  return (
    <Box
      border="2px solid"
      borderColor="blue.500"
      borderRadius="md"
      boxShadow={props.selected ? "0 0 10px gold" : ""}
      transition="box-shadow 0.1s ease"
      _hover={props.selected ? { boxShadow: "0 0 10px gold" } : { boxShadow: "0 0 10px blue" }}
      w="220px"
      bg="white"
    >
      <Flex direction="column" align="center">
        <Box w="full" p="0.5em" bg="blue.500" color="white">
          <Text fontWeight="bold" textAlign="center">
            {data.title}
          </Text>
        </Box>

        <Icon as={FaUserTie} w="3em" h="3em" color="blue.500" my="0.5em" />

        <VStack w="full" p="0.5em" align="start" spacing={1}>
          <HStack w="full">
            <Icon as={MdBusinessCenter} color="blue.500" />
            <Text fontSize="sm" fontWeight="medium">
              {data.department}
            </Text>
          </HStack>
          
          <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {data.description}
          </Text>
        </VStack>

        <Handle
          type="target"
          position={Position.Top}
          id="target"
          style={handleStyle}
          isConnectable={true}
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="source"
          style={handleStyle}
          isConnectable={true}
        />
      </Flex>
    </Box>
  );
}