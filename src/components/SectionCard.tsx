// src/components/SectionCard.tsx
import { Card, CardHeader, CardBody, Heading, Icon, Box, IconButton, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";
import { ModuleNotificationDTA } from "../api/ModulesNotifications";
import { useState } from "react";

interface SectionCardProps {
    name: string;
    icon: IconType;
    to: string;
    /** Modules allowed to see this card */
    supportedModules?: string[];
    /** Current accesses of the user */
    currentAccesos?: string[];
    /** Background color of the card */
    bgColor?: string;
    /** Notification for this module */
    notification?: ModuleNotificationDTA;
}

function SectionCard({ name, icon, to, supportedModules, currentAccesos, bgColor = "blue.100", notification }: SectionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Log para depurar notificaciones
    console.log(`SectionCard ${name} - notification prop:`, notification);

    // Log específico para COMPRAS
    if (supportedModules && supportedModules.includes('COMPRAS')) {
        console.log('SectionCard COMPRAS - notification prop:', notification);
        console.log('SectionCard COMPRAS - requireAtention:', notification?.requireAtention);
        console.log('SectionCard COMPRAS - Condición de renderizado:', Boolean(notification && notification.requireAtention));
    }

    // If supportedModules is provided, check if there's at least one module
    // in currentAccesos that is allowed, or if the user is "master".
    // If not, do not render anything.
    if (supportedModules && currentAccesos) {
        // Check if user is "master" (should have access to all modules)
        const isMaster = currentAccesos.includes('ROLE_MASTER');
        // Check if user has access to at least one of the supported modules
        const hasAccess = isMaster || currentAccesos.some(acceso => supportedModules.includes(acceso));
        if (!hasAccess) return null;
    }

    // Create style object with the provided background color
    const cardStyle = {
        p: "2em",
        m: "1em",
        bg: bgColor,
        ":hover": {
            bg: bgColor === "red.100" ? "red.300" : "blue.300",
        },
        ":active": {
            bg: bgColor === "red.100" ? "red.800" : "blue.800",
        },
        position: "relative", // Necesario para posicionar el icono de notificación
    };

    // Función para manejar el clic en el icono de notificación
    const handleNotificationClick = (e: React.MouseEvent) => {
        console.log(`SectionCard ${name} - Notification icon clicked`);
        e.preventDefault(); // Prevenir la navegación
        e.stopPropagation(); // Evitar que el evento se propague
        setIsOpen(!isOpen); // Alternar el estado del popover
    };

    return (
        <NavLink to={to}>
            <Card h={"full"} sx={cardStyle}>
                {/* Icono de notificación con Popover */}
                {notification && notification.requireAtention && (
                    console.log(`SectionCard ${name} - Mostrando icono de notificación, requireAtention:`, notification.requireAtention),
                    <Popover
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        placement="top"
                        closeOnBlur={true}
                    >
                        <PopoverTrigger>
                            <IconButton
                                aria-label="Notificación"
                                icon={<MdNotificationsActive />}
                                position="absolute"
                                top="0.5rem"
                                right="0.5rem"
                                size="sm"
                                colorScheme="red"
                                borderRadius="full"
                                onClick={handleNotificationClick}
                                zIndex={1}
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>{notification.message}</PopoverBody>
                        </PopoverContent>
                    </Popover>
                )}

                <CardHeader h={"40%"} borderBottom="0.1em solid" alignContent={"center"}>
                    <Heading as={"h2"} size={"sm"} fontFamily={"Comfortaa Variable"}>
                        {name}
                    </Heading>
                </CardHeader>
                <CardBody>
                    <Icon boxSize={"4em"} as={icon} />
                </CardBody>
            </Card>
        </NavLink>
    );
}

export default SectionCard;
