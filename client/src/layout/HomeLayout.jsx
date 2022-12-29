import { Container, Flex } from "@chakra-ui/react";

export default function HomeLayout({ children }) {
  return (
    <Container maxW="8xl" minH={"calc(100vh - 104px)"} display="flex" alignItems="center" flexDirection={"column"}>
      {children}
    </Container>
  );
}
