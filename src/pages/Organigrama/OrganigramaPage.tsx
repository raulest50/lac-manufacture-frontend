// src/pages/Organigrama/OrganigramaPage.tsx
import { useState, useEffect } from "react";
import { Container, Box, Spinner, Center, Text } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import OrganizationChart from "./components/OrganizationChart";
import { AccessLevel } from "./types";
import axios from "axios";
import { Authority, WhoAmIResponse } from "../../api/global_types.tsx";
import { useAuth } from "../../context/AuthContext";
import EndPointsURL from "../../api/EndPointsURL.tsx";

export default function OrganigramaPage() {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.VIEW);
  const [isMaster, setIsMaster] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationChartId, setOrganizationChartId] = useState<string | null>("org-1"); // ID temporal
  const { user } = useAuth();
  const endPoints = new EndPointsURL();

  // Obtener el nivel de acceso del usuario
  useEffect(() => {
    const fetchUserAccess = async () => {
      try {
        setIsLoading(true);

        // Obtener el nivel de acceso del usuario desde el endpoint whoami
        const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
        const authorities = response.data.authorities;

        // Buscar la autoridad para el módulo ORGANIGRAMA
        const organigramaAuthority = authorities.find(
            (auth:Authority) => auth.authority === "ACCESO_ORGANIGRAMA"
        );

        // Verificar si el usuario es master
        const userIsMaster = user === 'master';
        setIsMaster(userIsMaster);

        // Si se encuentra la autoridad, establecer el nivel de acceso
        if (organigramaAuthority) {
          setAccessLevel(parseInt(organigramaAuthority.nivel) as AccessLevel);
        } else if (userIsMaster) {
          // Si el usuario es master, darle nivel de edición
          setAccessLevel(AccessLevel.EDIT);
        } else {
          // Por defecto, nivel de visualización
          setAccessLevel(AccessLevel.VIEW);
        }

        // Aquí se debería obtener el ID del organigrama desde una API real
        // Por ahora, usamos un ID fijo
        setOrganizationChartId("org-1");

      } catch (error) {
        console.error("Error al obtener el nivel de acceso:", error);
        // En caso de error, establecer nivel de visualización por defecto
        setAccessLevel(AccessLevel.VIEW);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAccess();
  }, [user, endPoints.whoami]);


  return (
    <Container minW={['auto', 'container.lg', 'container.xl']} minH={"100vh"} w={"full"} h={'full'}>
      <MyHeader title={'Organigrama'} />

      {isLoading ? (
        <Center h="70vh">
          <Spinner size="xl" />
        </Center>
      ) : !organizationChartId ? (
        <Box p={8}>
          <Text>No se encontró ningún organigrama disponible.</Text>
        </Box>
      ) : (
        <Box>
          <OrganizationChart
            accessLevel={accessLevel}
            isMaster={isMaster}
            organizationChartId={organizationChartId}
          />
        </Box>
      )}
    </Container>
  );
}
