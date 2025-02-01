
import {useCallback, useState} from "react";
import {Box, Flex, Button, HStack, VStack} from "@chakra-ui/react";

import {
    ReactFlow, Node, Edge,
    Controls, MiniMap, BackgroundVariant, Background, useNodesState, useEdgesState, Connection, addEdge
}
    from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import MaterialPrimarioNode from "./MaterialPrimarioNode.tsx";
import ProcesoNode from "./ProcesoNode.tsx";


const nodeTypes = {
    materialPrimarioNode: MaterialPrimarioNode,
    procesoNode: ProcesoNode,
}

export default function ProcessDesigner(){

    const initialNodes:Node[] = [];
    const initialEdges:Edge[] = [];

    const zeroProcesoNode = {
        id:'0',
        data:{label:"Node 0",},
        position:{x:200, y:0},
        type:"procesoNode",
    }

    //const [mPrimariosNodes, setMPrimarioNodes] = useState<Node[]>([]);

    const [lastNode, setLastNode] = useState<Node>(zeroProcesoNode);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params:Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const agregarProcesoOnClick = () =>{
        const nextNode = {
            id:String(Number(lastNode.id)+1),
            data:{label:`Node ${String(Number(lastNode.id)+1)}`,},
            position:{x:200, y:lastNode.position.y+50},
            type:"procesoNode"
        };
        setNodes([...nodes, nextNode]);
        setLastNode(nextNode);
    };

    const semiTermiPickerOnClick = () => {

    };

    return(
        <Flex direction={"column"} gap={8} p={"1em"}>
            <Flex direction={"row"}></Flex>
            <HStack>

                <Button
                    variant={"solid"}
                    colorScheme={"green"}
                    onClick={semiTermiPickerOnClick}
                >{"Seleccionar Terminado/Semiterminado"}</Button>

                <VStack>

                </VStack>

            </HStack>

            <Box style={{ width: '50vw', height: '50vh', border:"1px solid black" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                >
                    <Controls/>
                    <MiniMap/>
                    <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
                </ReactFlow>
            </Box>
            <Flex direction={"row"} gap={5}>
                <Button
                    variant={"solid"}
                    colorScheme={"teal"}
                    onClick={agregarProcesoOnClick}
                >Agregar Proceso</Button>

                <Button
                    variant={"solid"}
                    colorScheme={"red"}
                    onClick={
                        ()=>{
                            setNodes(initialNodes);
                            setLastNode(zeroProcesoNode);
                        }
                    }
                >Remover Todos</Button>

                <Button
                    variant={"solid"}
                    colorScheme={"orange"}
                    onClick={
                        ()=>{
                            if(nodes.length >= 1) {
                                setNodes(nodes.slice(0, -1));
                                if(nodes.length == 1) setLastNode(zeroProcesoNode);
                                else setLastNode(nodes[nodes.length - 2]);
                            }
                        }
                    }
                >Remover Mas Reciente</Button>
            </Flex>
        </Flex>
    )

}