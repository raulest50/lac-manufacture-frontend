import { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaFileCircleCheck, FaFileCircleQuestion } from "react-icons/fa6";
import axios from "axios";

interface FileChooserProps {
  /** Title shown above the chooser */
  title: string;
  /** Small description or helper text */
  description?: string;
  /** Whether to show the input to upload from a link */
  showLinkInput?: boolean;
  /** Allowed file extensions, e.g. {'.xlsx': true, '.xls': true} */
  allowedExtensions: Record<string, boolean>;
  /** Callback that receives the chosen file */
  setFile: (file: File | null) => void;
}

function normalizeExt(ext: string) {
  return ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
}

export function FileChooser({
  title,
  description,
  showLinkInput = true,
  allowedExtensions,
  setFile,
}: FileChooserProps) {
  const [link, setLink] = useState("");
  const [file, setLocalFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const exts = Object.keys(allowedExtensions)
    .filter((e) => allowedExtensions[e])
    .map((e) => normalizeExt(e));
  const accept = exts.join(",");

  const validateFile = (f: File) => {
    const lower = f.name.toLowerCase();
    const valid = exts.some((ext) => lower.endsWith(ext));
    if (!valid) {
      toast({
        title: "Tipo de archivo no permitido",
        description: `Solo se permiten archivos: ${exts.join(", ")}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && validateFile(f)) {
      setLocalFile(f);
      setFile(f);
    } else {
      e.target.value = "";
    }
  };

  const handleUploadFromLink = async () => {
    try {
      if (!link.includes("docs.google.com/spreadsheets")) {
        throw new Error("La URL debe ser de un archivo de Google Sheets");
      }
      const match = link.match(/spreadsheets\/d\/([^/]+)/);
      const fileId = match && match[1] ? match[1] : "";
      if (!fileId) {
        throw new Error("No se pudo extraer el ID del archivo de la URL proporcionada");
      }
      const downloadUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
      const response = await axios.get(downloadUrl, { responseType: "blob" });
      const f = new File([response.data], "archivo.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      if (validateFile(f)) {
        setLocalFile(f);
        setFile(f);
        setLink("");
        toast({
          title: "Archivo cargado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al descargar el archivo";
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {title}
      </Text>
      {description && (
        <Text mb={4} fontSize="sm" color="gray.600">
          {description}
        </Text>
      )}
      {showLinkInput && (
        <FormControl mb={4}>
          <FormLabel>URL del archivo en Google Sheets</FormLabel>
          <HStack spacing={4} alignItems="start">
            <Input
              placeholder="Ingrese el enlace de Google Sheets"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              flex={1}
            />
            <Button colorScheme="blue" onClick={handleUploadFromLink} isDisabled={!link}>
              Cargar
            </Button>
          </HStack>
          <FormHelperText>Pegue la URL de un archivo compartido en Google Sheets</FormHelperText>
        </FormControl>
      )}
      <FormControl>
        <FormLabel>Archivo local</FormLabel>
        <HStack spacing={4} alignItems="center">
          <Button onClick={() => inputRef.current?.click()}>Seleccionar archivo</Button>
          <Input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            accept={accept}
            onChange={handleFileChange}
          />
          <Icon as={file ? FaFileCircleCheck : FaFileCircleQuestion} boxSize="2em" color={file ? "green" : "orange.500"} />
          {file && (
            <Text fontSize="sm" noOfLines={1}>
              {file.name}
            </Text>
          )}
        </HStack>
        <FormHelperText>Archivos permitidos: {exts.join(", ")}</FormHelperText>
      </FormControl>
    </Box>
  );
}
