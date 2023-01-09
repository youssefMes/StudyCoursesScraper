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
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import CheckboxGroup from "../components/CheckboxGroup";
import HomeLayout from "../layout/HomeLayout";
import { useNavigate } from "react-router-dom";
import { ReactComponent as BubbleMsg } from "../assets/bubble.svg";
import desk from "../assets/desk.png";
import { checkboxGroupItems } from "../utils/fakeData";
import { useQuery } from "react-query";
import { fetchFilters } from "../services/filters";

export default function LandingPage() {
  const [filters, setFilters] = useState({
    checkboxes: [],
    dropdowns: [],
  });
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    search: "",
    study_forms: [],
    cities: [],
    portals: [],
    languages: [],
    degrees: [],
  });

  const { isLoading: loadingFilters } = useQuery("filters", fetchFilters, {
    onSuccess: (res) => {
      const keys = Object.keys(res);
      for (const key of keys) {
        const elementLength = res[key].items.length;
        if (elementLength > 3) {
          setFilters((x) => ({
            ...x,
            dropdowns: [...x.dropdowns, { ...res[key], key }],
          }));
        } else {
          setFilters((x) => ({
            ...x,
            checkboxes: [...x.checkboxes, { ...res[key], key }],
          }));
        }
      }
    },
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { search, study_forms, cities, portals, languages, degrees } = form;
    console.log('form', form);
    navigate({
      pathname: "/search",
      search: `?search=${search}&study_forms=${study_forms}&cities=${cities}&portals=${portals}&degrees=${degrees}&languages=${languages}`,
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
            name="search"
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
              disabled={loadingFilters}
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
            <Grid
              gridTemplateColumns={{ base: "1fr", md: "repeat(3,1fr)" }}
              gap="5"
            >
              {filters.checkboxes.map((group) => (
                <GridItem key={group.name}>
                  <CheckboxGroup
                    groupTitle={group.name}
                    options={group.items}
                    onChange={onChange}
                    name={group.key}
                  />
                </GridItem>
              ))}
              {filters.dropdowns.map((group) => (
                <GridItem key={group.name}>
                  <Menu closeOnSelect={false}>
                    <Heading as="h3" fontSize="lg">
                      {group.name}
                    </Heading>
                    <MenuButton
                      mt="2"
                      noOfLines={1}
                      maxW="250px"
                      bg="white"
                      w="full"
                      as={Button}
                      border="1px solid black"
                      rounded="md"
                      display="flex"
                      textAlign={"left"}
                      alignItems={"flex-start"}
                      fontWeight={"normal"}
                      rightIcon={
                        <IoChevronDownOutline style={{ float: "right" }} />
                      }
                    >
                      {form?.[group.key]?.length > 0
                        ? form?.[group.key]?.join(", ")
                        : `${group.name} Auswhälen`}
                    </MenuButton>
                    <MenuList minWidth="240px" h={40} sx={{overflow:"scroll"}}>
                      <MenuOptionGroup
                        type="checkbox"
                        onChange={(val) =>
                          setForm({ ...form, [group.key]: val })
                        }
                      >
                        {group.items.map((item) => (
                          <MenuItemOption value={item} key={item}>
                            {item}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
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
