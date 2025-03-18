import { useState } from "react";
import { Container, Button, Input, useToast } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader";
import axios, {AxiosError} from "axios";
import EndPointsURL from "../../api/EndPointsURL.tsx";

const endpoints = new EndPointsURL();

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
            const response = await axios.post(endpoints.carga_masiva_mprims, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Assuming the response data contains the success message
            toast({
                title: "Upload successful",
                description: response.data,
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            setSelectedFile(null);
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
