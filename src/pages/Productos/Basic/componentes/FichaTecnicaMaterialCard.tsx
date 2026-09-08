import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Heading,
    HStack,
    Spinner,
    Text,
    chakra,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuDownload, LuEye, LuEyeOff, LuRefreshCw } from "react-icons/lu";
import {
    consultarFichaTecnicaMetadata,
    fichaTecnicaNoDisponible,
    obtenerFichaTecnicaPdf,
    solicitudFichaTecnicaCancelada,
} from "../../../../api/ProductoFichaTecnicaApi";
import { useAppToast } from "@/components/ui/use-app-toast";

type Availability = "checking" | "available" | "missing" | "error";

type Props = {
    productoId: string;
};

const PdfFrame = chakra("iframe");

function downloadFilename(productoId: string): string {
    const safeId = productoId.replace(/[^a-zA-Z0-9._-]/g, "-");
    return `ficha-tecnica-${safeId}.pdf`;
}

function triggerDownload(url: string, filename: string): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default function FichaTecnicaMaterialCard({ productoId }: Props) {
    const [availability, setAvailability] = useState<Availability>("checking");
    const [retryToken, setRetryToken] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const previewUrlRef = useRef<string | null>(null);
    const actionControllerRef = useRef<AbortController | null>(null);
    const toast = useAppToast();

    const releasePreview = useCallback(() => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        setPreviewUrl(null);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        actionControllerRef.current?.abort();
        actionControllerRef.current = null;
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        setPreviewUrl(null);
        setLoadingPreview(false);
        setDownloading(false);
        setAvailability("checking");

        void consultarFichaTecnicaMetadata(productoId, controller.signal)
            .then(({ disponible }) => setAvailability(disponible ? "available" : "missing"))
            .catch((error: unknown) => {
                if (!solicitudFichaTecnicaCancelada(error)) {
                    setAvailability("error");
                }
            });

        return () => controller.abort();
    }, [productoId, retryToken]);

    useEffect(() => () => {
        actionControllerRef.current?.abort();
        actionControllerRef.current = null;
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
    }, []);

    const handleUnavailableDownload = useCallback(() => {
        releasePreview();
        setAvailability("missing");
        toast({
            title: "Ficha tecnica no disponible",
            description: "El documento ya no se encuentra disponible.",
            status: "warning",
            duration: 3500,
            isClosable: true,
        });
    }, [releasePreview, toast]);

    const handleTogglePreview = async () => {
        if (previewUrlRef.current) {
            releasePreview();
            return;
        }

        const controller = new AbortController();
        actionControllerRef.current = controller;
        setLoadingPreview(true);
        try {
            const pdf = await obtenerFichaTecnicaPdf(productoId, controller.signal);
            const nextUrl = URL.createObjectURL(pdf);
            previewUrlRef.current = nextUrl;
            setPreviewUrl(nextUrl);
        } catch (error: unknown) {
            if (fichaTecnicaNoDisponible(error)) {
                handleUnavailableDownload();
            } else if (!solicitudFichaTecnicaCancelada(error)) {
                toast({
                    title: "No se pudo abrir la ficha tecnica",
                    description: "Intente nuevamente. La descarga permanece disponible.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        } finally {
            if (actionControllerRef.current === controller) {
                actionControllerRef.current = null;
                setLoadingPreview(false);
            }
        }
    };

    const handleDownload = async () => {
        const filename = downloadFilename(productoId);
        if (previewUrlRef.current) {
            triggerDownload(previewUrlRef.current, filename);
            return;
        }

        const controller = new AbortController();
        actionControllerRef.current = controller;
        setDownloading(true);
        try {
            const pdf = await obtenerFichaTecnicaPdf(productoId, controller.signal);
            const temporaryUrl = URL.createObjectURL(pdf);
            triggerDownload(temporaryUrl, filename);
            window.setTimeout(() => URL.revokeObjectURL(temporaryUrl), 1000);
        } catch (error: unknown) {
            if (fichaTecnicaNoDisponible(error)) {
                handleUnavailableDownload();
            } else if (!solicitudFichaTecnicaCancelada(error)) {
                toast({
                    title: "No se pudo descargar la ficha tecnica",
                    description: "Intente nuevamente en unos momentos.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        } finally {
            if (actionControllerRef.current === controller) {
                actionControllerRef.current = null;
                setDownloading(false);
            }
        }
    };

    const controlsDisabled = availability !== "available" || loadingPreview || downloading;

    return (
        <Card.Root mb={5} variant="outline" boxShadow="md" aria-busy={availability === "checking"}>
            <Card.Header bg="app.stepperBlue">
                <Flex
                    align={{ base: "flex-start", sm: "center" }}
                    justify="space-between"
                    direction={{ base: "column", sm: "row" }}
                    gap={2}
                >
                    <Heading size="md">Ficha tecnica</Heading>
                    <Box aria-live="polite">
                        {availability === "checking" && (
                            <HStack gap={2}>
                                <Spinner size="sm" />
                                <Text fontSize="sm">Comprobando disponibilidad...</Text>
                            </HStack>
                        )}
                        {availability === "available" && (
                            <Badge colorPalette="green">Disponible</Badge>
                        )}
                        {availability === "missing" && (
                            <Badge colorPalette="gray">No registrada</Badge>
                        )}
                    </Box>
                </Flex>
            </Card.Header>
            <Card.Body>
                <Flex direction="column" gap={4}>
                    {availability === "missing" && (
                        <Text color="fg.muted">Este material no tiene una ficha tecnica registrada.</Text>
                    )}
                    {availability === "error" && (
                        <Alert.Root status="error" alignItems="flex-start" borderRadius="md">
                            <Alert.Indicator />
                            <Box flex="1">
                                <Alert.Title>No se pudo comprobar la ficha tecnica</Alert.Title>
                                <Alert.Description>
                                    Verifique la conexion e intente nuevamente.
                                </Alert.Description>
                            </Box>
                            <Button
                                size="sm"
                                variant="outline"
                                colorPalette="red"
                                onClick={() => setRetryToken((current) => current + 1)}
                            >
                                <LuRefreshCw />
                                Reintentar
                            </Button>
                        </Alert.Root>
                    )}

                    <Flex direction={{ base: "column", sm: "row" }} gap={3} align={{ sm: "center" }}>
                        <Button
                            colorPalette="blue"
                            variant="outline"
                            disabled={controlsDisabled}
                            loading={loadingPreview}
                            loadingText="Abriendo"
                            onClick={() => void handleTogglePreview()}
                        >
                            {previewUrl ? <LuEyeOff /> : <LuEye />}
                            {previewUrl ? "Ocultar ficha tecnica" : "Ver ficha tecnica"}
                        </Button>
                        <Button
                            colorPalette="teal"
                            disabled={controlsDisabled}
                            loading={downloading}
                            loadingText="Descargando"
                            onClick={() => void handleDownload()}
                        >
                            <LuDownload />
                            Descargar PDF
                        </Button>
                    </Flex>

                    {previewUrl && (
                        <Box borderWidth="1px" borderRadius="md" overflow="hidden" bg="bg.subtle">
                            <PdfFrame
                                src={previewUrl}
                                title={`Ficha tecnica del material ${productoId}`}
                                width="100%"
                                height={{ base: "65vh", md: "720px" }}
                                border="0"
                                display="block"
                            />
                        </Box>
                    )}
                </Flex>
            </Card.Body>
        </Card.Root>
    );
}
