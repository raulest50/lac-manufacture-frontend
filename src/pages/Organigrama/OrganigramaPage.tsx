// src/pages/Organigrama/OrganigramaPage.tsx
import { useState, useEffect } from "react";
import { Container, Box, Spinner, Center, Text } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";
import OrganizationChart from "./components/OrganizationChart";
import PositionDetailsPage from "./components/PositionDetailsPage";
import { AccessLevel } from "./types";
import axios from "axios";
// Import mock data and API responses
import { mockApiResponses, mockOrganizationChart } from "./prototype_data";

export default function OrganigramaPage() {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.VIEW);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [organizationChartId, setOrganizationChartId] = useState<string | null>(null);

  // Obtener el nivel de acceso del usuario y el ID del organigrama
  useEffect(() => {
    const fetchUserAccess = async () => {
      try {
        setIsLoading(true);
        // Usar datos mock en lugar de llamadas a API reales
        const userResponse = await mockApiResponses.getUserAccess();
        setAccessLevel(userResponse.data.accessLevel);

        // Obtener el ID del organigrama mock
        const chartResponse = await mockApiResponses.getOrganizationCharts();
        if (chartResponse.data.length > 0) {
          setOrganizationChartId(chartResponse.data[0].id);
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAccess();
  }, []);

  // Manejar la navegación a los detalles de una posición
  const handleNavigateToDetails = (positionId: string) => {
    setSelectedPositionId(positionId);
  };

  // Volver al organigrama desde la página de detalles
  const handleBackToChart = () => {
    setSelectedPositionId(null);
  };

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
      ) : selectedPositionId ? (
        <Box p={4}>
          <PositionDetailsPage
            positionId={selectedPositionId}
            accessLevel={accessLevel}
            onBack={handleBackToChart}
          />
        </Box>
      ) : (
        <Box>
          <OrganizationChart
            accessLevel={accessLevel}
            organizationChartId={organizationChartId}
            onNavigateToDetails={handleNavigateToDetails}
          />
        </Box>
      )}
    </Container>
  );
}
