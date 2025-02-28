import {useCallback, useState} from "react";
import {Box, Flex, Button, Heading, Divider} from "@chakra-ui/react";

import {
    ReactFlow, Node, Edge,
    Controls, MiniMap, BackgroundVariant, Background, useNodesState, useEdgesState, Connection, addEdge
}
    from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import MaterialPrimarioNode from "./Nodos/MaterialPrimarioNode.tsx";
import ProcesoNode from "./Nodos/ProcesoNode.tsx";
import {Target} from "./types.tsx";
import TargetNode from "./Nodos/TargetNode.tsx";


const nodeTypes = {
    materialPrimarioNode: MaterialPrimarioNode,
    procesoNode: ProcesoNode,
    targetNode: TargetNode,
}


interface props{
    target: Target;
}

export default function ProcessDesigner( {target}:props ){


    const getMatPrimasNodes = (target: Target): Node[] => {
        return target.insumos.map((insumo, index) => ({
            id: `mp-${insumo.producto.productoId}`, // unique id for each node
            data: { label: insumo.producto.nombre, tipo_unidad: insumo.producto.tipoUnidades, cantidad: insumo.cantidadRequerida },
            // Position the nodes vertically with a gap, adjust x and y as needed
            position: { x: 50, y: index * 200 },
            type: "materialPrimarioNode",
        }));
    };

    const getTargetNode = (target: Target): Node => {
        return {
            id:'tg',
            data:{label:target.nombre, tipo_unidad: target.tipoUnidades, tipo_producto: target.tipo_producto},
            position:{x:500, y:210},
            type:"targetNode",
        };
    }

    const deleteNodeById = (id: string) => {
        // write here a funtion to delete a node by id and all its related edges
    }

    const initialNodes:Node[] = [...getMatPrimasNodes(target), getTargetNode(target), ];
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

    return(
        <Flex direction={"column"} gap={8} p={"1em"} >
            <Flex direction={"row"}>
                <Heading flex={2} as={'h2'} size={'lg'} fontFamily={'Comfortaa Variable'}>Process Designer</Heading>
            </Flex>

            <Divider/>

            <Box w={'fill'} style={{  height: '50vh', border:"1px solid black" }}>
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