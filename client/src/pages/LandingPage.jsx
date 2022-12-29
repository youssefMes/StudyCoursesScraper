import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CheckboxGroup from "../components/CheckboxGroup";
import HomeLayout from "../layout/HomeLayout";
import { useNavigate } from "react-router-dom";
import { ReactComponent as BubbleMsg } from "../assets/bubble.svg";
import desk from "../assets/desk.png";
import { checkboxGroupItems } from "../utils/fakeData";

export default function LandingPage() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    keyword: "",
    zulassungsmodus: [],
    abschluss: [],
    studienbeginn: [],
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { keyword, abschluss, studienbeginn, zulassungsmodus } = form;
    navigate({
      pathname: "/search",
      search: `?q=${keyword}&abschluss=${abschluss}&studienbeginn=${studienbeginn}&zulassungsmodus=${zulassungsmodus}`,
    });
  };

  return (
    <HomeLayout>
      <Stack
        width={"full"}
        spacing={0}
        flex={1}
        justify="center"
        minH={"calc(100vh - 104px)"}
      >
        <Stack
          bg="light"
          width="full"
          as="form"
          p="8"
          rounded={"xl"}
          borderBottomRadius={isOpen ? "none" : "xl"}
          direction={{ base: "column", md: "row" }}
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Suche nach Studiengang"
            variant="primary"
            name="keyword"
            onChange={onChange}
            p="4"
            size="lg"
          />
          <Button type="submit" variant="primary" size="lg">
            Suchen
          </Button>
          <Tooltip label="Erweiterte Suche" hasArrow rounded={"md"}>
            <IconButton
              onClick={onToggle}
              aria-label="Erweiterte Suche"
              icon={
                <FaChevronDown
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              }
              size="lg"
              variant="ghost"
              bg={isOpen ? "blackAlpha.50" : "transparent"}
            />
          </Tooltip>
        </Stack>
        <Collapse in={isOpen} animateOpacity>
          <Box p="40px" pt="0" bg="light" borderBottomRadius={"xl"}>
            <Heading as="h2" textAlign={"center"} fontSize="xl">
              Erweiterte Suche
            </Heading>
            <Divider my="4" />
            <Grid gridTemplateColumns={{ base: "1fr", md: "repeat(3,1fr)" }}>
              {checkboxGroupItems.map((group) => (
                <GridItem key={group.name}>
                  <CheckboxGroup
                    groupTitle={group.groupTitle}
                    options={group.options}
                    onChange={onChange}
                    name={group.name}
                  />
                </GridItem>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Stack>
      <Box flex={0} alignSelf="flex-start" mb="8" p="4">
        <Grid
          gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
          alignItems="center"
          gap={{ base: "10", md: "40" }}
        >
          <GridItem>
            <Image src={desk} alt={"Frequently asked questions"} />
          </GridItem>
          <GridItem>
            <Stack spacing={4}>
              <Heading fontWeight={"light"} maxW="md">
                The one place to answer all your learning needs
              </Heading>
              <Text maxW={"md"}>
                Huge online learning and teaching marketplace with over 204000
                courses and 54 million students. Learn programming, marketing,
                data science and more.
              </Text>
              <Button variant={"primary"} alignSelf="flex-start">
                Join us for free
              </Button>
            </Stack>
          </GridItem>
        </Grid>
        <Grid
          gridTemplateColumns={{ base: "1fr 0.1fr", md: "1fr 0.2fr" }}
          alignItems="center"
          gap={{ base: "10", md: "40" }}
          my="8"
        >
          <GridItem>
            <Heading fontWeight={"light"}>Frequently asked questions</Heading>
          </GridItem>
          <GridItem>
            <BubbleMsg />
          </GridItem>
        </Grid>
      </Box>
    </HomeLayout>
  );
}
