// src/pages/Organigrama/OrganigramaPage.tsx
import { useState, useEffect } from "react";
import { 
  Container, 
  Box, 
  Spinner, 
  Center, 
  Text, 
  Flex, 
  IconButton, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Collapse,
  useDisclosure
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import MyHeader from "../../components/MyHeader.tsx";
import OrganizationChart from "./components/OrganizationChart";
import { MisionVision } from "./MisionVision";
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

  // Estado para el panel lateral
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  // Estado para las pestañas
  const [tabIndex, setTabIndex] = useState(0);

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
        <Flex>
          {/* Panel lateral colapsable */}
          <Flex 
            direction="column" 
            bg="white" 
            borderRight="1px" 
            borderColor="gray.200"
            position="relative"
          >
            {/* Botón para colapsar/expandir el panel */}
            <IconButton
              aria-label={isOpen ? "Colapsar panel" : "Expandir panel"}
              icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              position="absolute"
              right="-16px"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              size="sm"
              onClick={onToggle}
              borderRadius="full"
              boxShadow="md"
            />

            {/* Contenido del panel lateral */}
            <Collapse in={isOpen} animateOpacity>
              <Box w="250px" p={4}>
                <Tabs 
                  variant="unstyled" 
                  colorScheme="blue" 
                  orientation="vertical"
                  index={tabIndex} 
                  onChange={(index) => setTabIndex(index)}
                >
                  <TabList mb="1em" spacing={3}>
                    <Tab 
                      py={3}
                      px={4}
                      borderRadius="md"
                      fontWeight="medium"
                      _hover={{ bg: "blue.50", color: "blue.600" }}
                      _selected={{ bg: "blue.100", color: "blue.700", fontWeight: "bold" }}
                      transition="all 0.2s"
                    >
                      Organigrama
                    </Tab>
                    <Tab 
                      py={3}
                      px={4}
                      borderRadius="md"
                      fontWeight="medium"
                      _hover={{ bg: "blue.50", color: "blue.600" }}
                      _selected={{ bg: "blue.100", color: "blue.700", fontWeight: "bold" }}
                      transition="all 0.2s"
                    >
                      Misión y Visión
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}></TabPanel>
                    <TabPanel p={0}></TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Collapse>
          </Flex>

          {/* Contenido principal */}
          <Box flex="1" ml={isOpen ? 4 : 0}>
            <Tabs 
              variant="enclosed" 
              colorScheme="blue" 
              isLazy 
              index={tabIndex} 
              onChange={(index) => setTabIndex(index)}
            >
              <TabList display="none">
                <Tab>Organigrama</Tab>
                <Tab>Misión y Visión</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <OrganizationChart
                    accessLevel={accessLevel}
                    isMaster={isMaster}
                    organizationChartId={organizationChartId}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <MisionVision />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      )}
    </Container>
  );
}
