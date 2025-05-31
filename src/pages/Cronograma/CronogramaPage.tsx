import { Container } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader";

export default function CronogramaPage() {
    return (
        <Container minW={["auto", "container.lg", "container.xl"]} w="full" h="full">
            <MyHeader title="Cronograma" />
            {/* Add your content here */}
            <p>Página de Cronograma</p>
        </Container>
    );
}