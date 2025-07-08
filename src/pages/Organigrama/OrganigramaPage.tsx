// src/pages/Organigrama/OrganigramaPage.tsx
import { Container } from "@chakra-ui/react";
import MyHeader from "../../components/MyHeader.tsx";

export default function OrganigramaPage() {
  return (
    <Container minW={['auto', 'container.lg', 'container.xl']} minH={"100vh"} w={"full"} h={'full'}>
      <MyHeader title={'Organigrama'} />
      {/* Contenido vacío por ahora */}
    </Container>
  );
}