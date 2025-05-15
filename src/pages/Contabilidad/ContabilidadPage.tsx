import { Container, Flex } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";

export default function ContabilidadPage() {
    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w={'full'} h={'full'}>
            <MyHeader title={'Contabilidad'} />
            <Flex direction="column" w="full" h="full">
                {/* Empty page as requested */}
            </Flex>
        </Container>
    );
}