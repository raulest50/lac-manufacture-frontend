// src/components/SectionCard.tsx
import { Card, CardHeader, CardBody, Heading, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

const my_sc_style = {
    p: "2em",
    m: "1em",
    bg: "blue.100",
    ":hover": {
        bg: "blue.300",
    },
    ":active": {
        bg: "blue.800",
    },
};

interface SectionCardProps {
    name: string;
    icon: IconType;
    to: string;
    /** Roles allowed to see this card */
    supportedRoles?: string[];
    /** Current roles of the user */
    currentRoles?: string[];
}

function SectionCard({ name, icon, to, supportedRoles, currentRoles }: SectionCardProps) {
    // If supportedRoles is provided, check if there's at least one role
    // in currentRoles that is allowed. If not, do not render anything.
    if (supportedRoles && currentRoles) {
        const hasAccess = currentRoles.some(role => supportedRoles.includes(role));
        if (!hasAccess) return null;
    }

    return (
        <NavLink to={to}>
            <Card h={"full"} sx={my_sc_style}>
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
