import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import desk from "../assets/desk.png";

export default function SplitScreen({ title, children }) {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex flex={1} bg="primary" position="relative">
        <Link to="/">
          <Button
            m="4"
            variant={"ghost"}
            position={"absolute"}
            leftIcon={<FaChevronLeft />}
          >
            Startseite
          </Button>
        </Link>
        <Image
          src={desk}
          objectFit={"contain"}
          alt={"Register Image"}
          w="90%"
          maxW="4xl"
          mx="auto"
        />
      </Flex>
      <Flex p={8} flex={0.5} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "primary",
                zIndex: -1,
              }}
            >
              {title}
            </Text>
          </Heading>
          {children}
        </Stack>
      </Flex>
    </Stack>
  );
}
