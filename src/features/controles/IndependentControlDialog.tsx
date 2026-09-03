import {
    Alert,
    Badge,
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    Input,
    Portal,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAppToast } from "../../components/ui/use-app-toast";
import { apiFailureDetail, type ControlDomainApi } from "./api";
import type { LoteControlOption } from "./types";

interface IndependentControlDialogProps {
    api: ControlDomainApi;
    onCreated: () => void;
}

export default function IndependentControlDialog({ api, onCreated }: IndependentControlDialogProps) {
    const toast = useAppToast();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [lots, setLots] = useState<LoteControlOption[]>([]);
    const [selected, setSelected] = useState<LoteControlOption | null>(null);
    const [loading, setLoading] = useState(false);

    const findLots = async () => {
        setLoading(true);
        try {
            setLots(await api.searchLotes(search));
            setSelected(null);
        } catch (error) {
            toast({ title: "No fue posible buscar lotes", description: apiFailureDetail(error, "Error de consulta.").message, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;
        let mounted = true;
        setLoading(true);
        api.searchLotes()
            .then((items) => mounted && setLots(items))
            .catch((error) => mounted && toast({ title: "No fue posible buscar lotes", description: apiFailureDetail(error, "Error de consulta.").message, status: "error" }))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [api, open, toast]);

    const create = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            const requirements = await api.createIndependentRequirements(selected.id);
            toast({
                title: "Controles independientes preparados",
                description: `${requirements.length} requisito(s) aplicable(s) resueltos por el backend.`,
                status: "success",
            });
            setOpen(false);
            onCreated();
        } catch (error) {
            toast({ title: "No fue posible preparar el lote", description: apiFailureDetail(error, "No existen planes aplicables vigentes.").message, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={({ open: next }) => setOpen(next)} size="xl" scrollBehavior="inside">
            <Dialog.Trigger asChild><Button colorPalette="teal">Registrar sin expediente</Button></Dialog.Trigger>
            <Portal><Dialog.Backdrop /><Dialog.Positioner><Dialog.Content maxW="4xl"><Dialog.Header><Dialog.Title>Preparar controles independientes por lote</Dialog.Title></Dialog.Header><Dialog.CloseTrigger asChild><CloseButton aria-label="Cerrar selector de lote" size="sm" /></Dialog.CloseTrigger><Dialog.Body><VStack align="stretch" gap={4}><Alert.Root status="info"><Alert.Indicator />Seleccione únicamente el lote. El backend determina todos los planes, versiones y reglas aplicables; no se admiten mediciones ad hoc.</Alert.Root><HStack align="end"><Field.Root flex="1"><Field.Label>Lote o producto</Field.Label><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void findLots()} /></Field.Root><Button loading={loading} onClick={() => void findLots()}>Buscar</Button></HStack><Box overflowX="auto"><Table.Root size="sm"><Table.Header><Table.Row><Table.ColumnHeader>Lote</Table.ColumnHeader><Table.ColumnHeader>Producto</Table.ColumnHeader><Table.ColumnHeader>Orden</Table.ColumnHeader><Table.ColumnHeader>Expediente</Table.ColumnHeader><Table.ColumnHeader /></Table.Row></Table.Header><Table.Body>{lots.map((lot) => <Table.Row key={lot.id} bg={selected?.id === lot.id ? "bg.subtle" : undefined}><Table.Cell fontWeight="semibold">{lot.lote}</Table.Cell><Table.Cell>{lot.productoId}<Text fontSize="xs" color="fg.muted">{lot.productoNombre}</Text></Table.Cell><Table.Cell><Badge>{lot.tipoOrden}</Badge></Table.Cell><Table.Cell>{lot.batchRecordCodigo ? <Box><Text>{lot.batchRecordCodigo}</Text><Text fontSize="xs" color="fg.muted">Use su bandeja materializada.</Text></Box> : "Sin expediente"}</Table.Cell><Table.Cell textAlign="end"><Button size="xs" variant={selected?.id === lot.id ? "solid" : "outline"} colorPalette="teal" disabled={lot.batchRecordId != null} onClick={() => setSelected(lot)}>{lot.batchRecordId != null ? "Desde expediente" : selected?.id === lot.id ? "Seleccionado" : "Seleccionar"}</Button></Table.Cell></Table.Row>)}</Table.Body></Table.Root>{!loading && !lots.length && <Text py={6} textAlign="center" color="fg.muted">No hay lotes de manufactura para mostrar.</Text>}</Box></VStack></Dialog.Body><Dialog.Footer><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button colorPalette="teal" loading={loading} disabled={!selected} onClick={() => void create()}>Resolver planes aplicables</Button></Dialog.Footer></Dialog.Content></Dialog.Positioner></Portal>
        </Dialog.Root>
    );
}
