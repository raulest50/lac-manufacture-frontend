// src/components/SectionCard.tsx
import { Card, CardHeader, CardBody, Heading, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

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
}


function SectionCard({ name, icon, to, supportedModules, currentAccesos, bgColor = "blue.100" }: SectionCardProps) {
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
    };

    return (
        <NavLink to={to}>
            <Card h={"full"} sx={cardStyle}>
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
