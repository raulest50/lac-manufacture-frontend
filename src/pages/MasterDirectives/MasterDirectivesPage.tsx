import { useEffect, useState, useMemo } from "react";
import {
    Container,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Switch,
    Textarea,
    Button,
    Icon,
    HStack,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { FaCircleExclamation } from "react-icons/fa6";
import axios from "axios";
import EndPointsURL from "../../api/EndPointsURL";
import MyHeader from "../../components/MyHeader";

interface MasterDirective {
    id: number;
    nombre: string;
    resumen: string;
    valor: string;
    tipoDato: "TEXTO" | "NUMERO" | "DECIMAL" | "BOOLEANO" | "FECHA" | "JSON";
    grupo: string;
    ayuda: string;
}

interface DirectiveState {
    original: MasterDirective;
    current: MasterDirective;
    isUpdating: boolean;
}

interface DTOAllMasterDirectives {
    masterDirectives: MasterDirective[];
}

export default function MasterDirectivesPage() {
    const [directives, setDirectives] = useState<DirectiveState[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const endPoints = useMemo(() => new EndPointsURL(), []);

    useEffect(() => {
        const fetchDirectives = async () => {
            try {
                const res = await axios.get<DTOAllMasterDirectives>(endPoints.get_master_directives);
                const data = res.data.masterDirectives;
                const mapped: DirectiveState[] = data.map(md => ({
                    original: md,
                    current: { ...md },
                    isUpdating: false,
                }));
                setDirectives(mapped);
                const groups = Array.from(new Set(data.map(md => md.grupo)));
                setSelectedGroup(groups[0] ?? "");
            } catch (err) {
                console.error("Error fetching master directives", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDirectives();
    }, [endPoints]);

    const groups = Array.from(new Set(directives.map(d => d.current.grupo)));
    const isAnyUpdating = directives.some(d => d.isUpdating);

    const updateDirectiveValue = (id: number, value: string) => {
        setDirectives(prev =>
            prev.map(d =>
                d.original.id === id
                    ? { ...d, current: { ...d.current, valor: value } }
                    : d
            )
        );
    };

    const renderValueInput = (directive: DirectiveState) => {
        const value = directive.current.valor ?? "";
        const onChange = (val: string) => updateDirectiveValue(directive.original.id, val);
        switch (directive.current.tipoDato) {
            case "BOOLEANO":
                return (
                    <Switch
                        isChecked={value === "true"}
                        onChange={e => onChange(e.target.checked ? "true" : "false")}
                    />
                );
            case "NUMERO":
                return (
                    <Input type="number" value={value} onChange={e => onChange(e.target.value)} />
                );
            case "DECIMAL":
                return (
                    <Input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                    />
                );
            case "FECHA":
                return (
                    <Input type="date" value={value} onChange={e => onChange(e.target.value)} />
                );
            case "JSON":
                return (
                    <Textarea value={value} onChange={e => onChange(e.target.value)} />
                );
            default:
                return <Input value={value} onChange={e => onChange(e.target.value)} />;
        }
    };

    const handleUpdate = async (directive: DirectiveState) => {
        setDirectives(prev =>
            prev.map(d =>
                d.original.id === directive.original.id
                    ? { ...d, isUpdating: true }
                    : d
            )
        );
        try {
            const body = {
                oldMasterDirective: directive.original,
                newMasterDirective: directive.current,
            };
            const res = await axios.put<MasterDirective>(endPoints.update_master_directive, body);
            const updated = res.data;
            setDirectives(prev =>
                prev.map(d =>
                    d.original.id === directive.original.id
                        ? { original: updated, current: { ...updated }, isUpdating: false }
                        : d
                )
            );
        } catch (err) {
            console.error("Error updating master directive", err);
            setDirectives(prev =>
                prev.map(d =>
                    d.original.id === directive.original.id
                        ? { ...d, isUpdating: false }
                        : d
                )
            );
        }
    };

    if (loading) {
        return (
            <Container minW={["auto", "container.lg", "container.xl"]} w="full" h="full">
                <MyHeader title="Master Directives" />
                <Spinner />
            </Container>
        );
    }

    const filtered = directives.filter(d => !selectedGroup || d.current.grupo === selectedGroup);

    return (
        <Container minW={["auto", "container.lg", "container.xl"]} w="full" h="full">
            <MyHeader title="Master Directives" />
            <Select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                mb={4}
                w="sm"
            >
                {groups.map(g => (
                    <option key={g} value={g}>
                        {g}
                    </option>
                ))}
            </Select>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Nombre</Th>
                        <Th>Valor</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filtered.map(d => {
                        const hasChanges = d.current.valor !== d.original.valor;
                        return (
                            <Tr key={d.current.id}>
                                <Td>
                                    <Text fontWeight="bold">{d.current.nombre}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {d.current.resumen}
                                    </Text>
                                </Td>
                                <Td>
                                    <HStack>
                                        {renderValueInput(d)}
                                        {hasChanges && (
                                            <Icon as={FaCircleExclamation} color="orange.400" />
                                        )}
                                    </HStack>
                                </Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => handleUpdate(d)}
                                        isDisabled={!hasChanges || (isAnyUpdating && !d.isUpdating)}
                                        isLoading={d.isUpdating}
                                    >
                                        Update
                                    </Button>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Container>
    );
}
