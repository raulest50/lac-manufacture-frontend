import { useState } from "react";
import { Container, Button, Input, useToast } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader";
import {AxiosError} from "axios";

export default function CargaMasivaPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const toast = useToast();

    // Validate that the file is an Excel file (.xlsx or .xls)
    const isValidExcel = (file:File) => {
        return file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return; // Early return if files is null

        const file = files[0];
        if (file && !isValidExcel(file)) {
            toast({
                title: "Invalid file",
                description: "Please select a valid Excel file (.xlsx or .xls).",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/productos/bulk_upload_excel", {
                method: "POST",
                body: formData,
            });
            const message = await response.text();
            if (response.ok) {
                toast({
                    title: "Upload successful",
                    description: message,
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                });
                setSelectedFile(null);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            const e = error as AxiosError;
            toast({
                title: "Upload failed",
                description: e.message,
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    return (
        <Container minW={["auto", "container.lg", "container.xl"]} w="full" h="full">
            <MyHeader title="Carga Masiva" />
            <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                mb={4}
            />
            <Button onClick={handleUpload} colorScheme="blue" isDisabled={!selectedFile}>
                Upload Excel File
            </Button>
        </Container>
    );
}
