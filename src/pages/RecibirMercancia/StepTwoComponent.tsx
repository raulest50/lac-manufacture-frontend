import React, { useState, useRef } from "react";
import { OrdenCompra } from "./types.tsx";
import {
    Button,
    Divider,
    Flex,
    Heading,
    Icon,
    IconButton,
    Text,
    useToast,
} from "@chakra-ui/react";
import { MdAddAPhoto } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import axios from "axios";

interface StepTwoComponentProps {
    setActiveStep: (step: number) => void;
    selectedOrder: OrdenCompra;
}

export default function StepTwoComponent({
                                             setActiveStep,
                                             selectedOrder,
                                         }: StepTwoComponentProps) {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    // Handles file selection from either input
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    // Triggers the file browsing input
    const onClickBrowse = () => {
        fileInputRef.current?.click();
    };

    // Checks for available camera(s) and triggers the camera capture input
    const onClickCamera = () => {
        if (
            navigator.mediaDevices &&
            navigator.mediaDevices.enumerateDevices
        ) {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    const videoInputs = devices.filter(
                        (device) => device.kind === "videoinput"
                    );
                    if (videoInputs.length > 0) {
                        cameraInputRef.current?.click();
                    } else {
                        toast({
                            title: "No camera detected",
                            description:
                                "Your device does not have a camera available.",
                            status: "warning",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
                .catch(() => {
                    toast({
                        title: "Error accessing devices",
                        description:
                            "Could not check for camera availability.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                });
        } else {
            toast({
                title: "Camera not supported",
                description:
                    "Camera API is not supported on your browser.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // When continuing, package the file and order into a FormData and post it.
    const onClickContinuar = async () => {
        if (!file) {
            toast({
                title: "No file selected",
                description:
                    "Please select or capture a file before continuing.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        /**
         * Here i want to put the code to complete this component
         */

        setActiveStep(3);

    };

    return (
        <Flex
            p="1em"
            direction="column"
            backgroundColor="blue.50"
            gap={8}
            alignItems="center"
        >
            <Heading fontFamily="Comfortaa Variable">
                Adjuntar Documento Soporte
            </Heading>

            <Text fontFamily="Comfortaa Variable">
                Debe adjuntar un documento soporte para terminar de diligenciar el
                formato de ingreso a almacén.
            </Text>
            <Text fontFamily="Comfortaa Variable">
                El soporte lo puede adjuntar tomando una foto del documento físico
                presentado por el proveedor o adjuntando un scan del mismo.
            </Text>
            <Divider />
            <Flex
                direction="row"
                gap="10em"
                p="1em"
                justifyContent="center"
                w="full"
            >
                <IconButton
                    colorScheme="teal"
                    icon={<FaFolderOpen />}
                    aria-label="Buscar Archivo"
                    fontSize="5em"
                    w="2em"
                    h="2em"
                    onClick={onClickBrowse}
                />
                <IconButton
                    colorScheme="teal"
                    icon={<MdAddAPhoto />}
                    aria-label="Tomar una Foto"
                    fontSize="5em"
                    w="2em"
                    h="2em"
                    onClick={onClickCamera}
                />
            </Flex>

            <Divider />

            <Flex
                direction="row"
                gap="1em"
                p="1em"
                justifyContent="center"
                w="full"
            >
                <Icon
                    as={file ? FaFileCircleCheck : FaFileCircleQuestion}
                    boxSize="4em"
                    color={file ? "green" : "orange.500"}
                />
                <Text fontFamily="Comfortaa Variable">
                    {file
                        ? "Se ha cargado el documento soporte correctamente y puede continuar al paso final."
                        : "Aún no ha subido ningún archivo/foto soporte."}
                </Text>
            </Flex>

            <Button
                colorScheme="teal"
                variant="solid"
                onClick={onClickContinuar}
                isDisabled={!file}
            >
                Continuar
            </Button>

            {/* Hidden input for file browsing */}
            <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            {/* Hidden input for camera capture */}
            <input
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                ref={cameraInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </Flex>
    );
}
