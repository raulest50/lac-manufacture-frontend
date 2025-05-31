import { Container } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader";

export default function MasterConfigsPage() {
    return (
        <Container minW={["auto", "container.lg", "container.xl"]} w="full" h="full">
            <MyHeader title="Master Config" />
            {/* Add your content here */}
            <p>Página de Master Config</p>
        </Container>
    );
}