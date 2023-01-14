import { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import HomeLayout from "../layout/HomeLayout";
import CheckboxGroup from "../components/CheckboxGroup";
import { fetchFilters } from "../services/filters";
import { FaChevronDown } from "react-icons/fa";
import { ReactComponent as BubbleMsg } from "../assets/bubble.svg";
import desk from "../assets/desk.svg";
import MultiSelect from "../components/MultiSelect";

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
    navigate({
      pathname: "/search",
      search: `?search=${search}&study_forms=${study_forms}&cities=${cities}&portals=${portals}&degrees=${degrees}&languages=${languages}`,
    });
  };

  const styles = {
    menuList: (base) => ({
      ...base,
      "::-webkit-scrollbar": {
        width: "10px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
  };

  return (
    <HomeLayout>
      <Stack width={"full"} spacing={0} flex={1} mt="172px" mb="20">
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
                <GridItem key={group.name} maxW="300px">
                  <Heading as="h3" fontSize="lg" mb="3">
                    {group.name}
                  </Heading>
                  <MultiSelect
                    options={group.items.map((el) => ({
                      value: el,
                      label: el,
                    }))}
                    field={group.key}
                    onChange={(val) => setForm({ ...form, ...val })}
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
              <Heading fontSize={"3xl"} fontWeight={"light"} maxW="2xl">
                Der einzige Ort, der Informationen und Bewertungen von
                Studiengängen und Universitäten in Deutschland bietet.
              </Heading>
              <Text maxW={"2xl"}>
                Hier können Studierende und Studieninteressierte verschiedene
                Studiengänge und Hochschulen recherchieren, Bewertungen von
                aktuellen und ehemaligen Studierenden lesen und verschiedene
                Optionen vergleichen.
              </Text>
              <Link to="/register">
                <Button variant={"primary"} alignSelf="flex-start">
                  Kostenlos registrieren
                </Button>
              </Link>
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
            <Heading fontWeight={"light"}>Häufig gestellte Fragen</Heading>
          </GridItem>
          <GridItem>
            <BubbleMsg />
          </GridItem>
        </Grid>
      </Box>
    </HomeLayout>
  );
}
