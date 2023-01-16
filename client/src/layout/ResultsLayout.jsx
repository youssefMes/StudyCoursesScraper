import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  Accordion,
  Stack,
  StackDivider,
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
  Button,
  GridItem,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Heading,
} from "@chakra-ui/react";
import { IoChevronDownOutline } from "react-icons/io5";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import CheckboxGroup from "../components/CheckboxGroup";
import { useSearchParams } from "react-router-dom";
import { fetchFilters } from "../services/filters";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import MultiSelect from "../components/MultiSelect";

export default function ResultsLayout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={"white"} paddingTop={"72px"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 80 }} p="4" pt="8">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const [form, setForm] = useState({
    search: "",
    study_forms: [],
    cities: [],
    portals: [],
    languages: [],
    degrees: [],
  });
  const [searchParams] = useSearchParams({});
  const search = searchParams.get("search");
  const [filters, setFilters] = useState({
    checkboxes: [],
    dropdowns: [],
  });
  const navigate = useNavigate();
  useQuery(["filters"], fetchFilters, {
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
  useEffect(() => {
    const entries = Array.from(searchParams.entries());
    let value = "";
    let newForm = {};
    for (const [key, val] of entries) {
      value = val;
      if (key !== "search") {
        value = searchParams.get(key).split(",").filter(Boolean);
      }
      if (value) {
        newForm = { ...newForm, [key]: value };
      }
    }
    setForm({
      ...form,
      ...newForm,
    });
  }, []);

  const onCheckBoxChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    navigateTo({ ...form, [e.target.name]: e.target.value });
  };
  const navigateTo = (form) => {
    const { search, study_forms, cities, portals, languages, degrees } = form;

    navigate({
      pathname: "/search",
      search: `?search=${search}&study_forms=${study_forms}&cities=${cities}&portals=${portals}&degrees=${degrees}&languages=${languages}`,
    });
  };
  return (
    <Box
      bg={"light"}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 80 }}
      pos="fixed"
      h="full"
      p="4"
      pt="8"
      {...rest}
    >
      <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      <Stack spacing={"12"}>
        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Suche nach Studiengang"
              name="search"
              focusBorderColor="primary"
              variant="primary"
              defaultValue={search}
              onChange={(e) => {
                setForm({ ...form, [e.target.name]: e.target.value });
              }}
            />
          </InputGroup>
          <Button variant={"primary"} onClick={() => navigateTo(form)}>
            Suchen
          </Button>
        </HStack>
        <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
          <Stack divider={<StackDivider borderColor={"blackAlpha.300"} />}>
            {filters.checkboxes.map((group) => (
              <GridItem key={group.name}>
                <CheckboxGroup
                  groupTitle={group.name}
                  options={group.items}
                  onChange={onCheckBoxChange}
                  name={group.key}
                  defaultValue={form[group.key]}
                />
              </GridItem>
            ))}
            {filters.dropdowns.map((group) => (
              <GridItem key={group.name}>
                <Heading as="h3" fontSize="lg" mb="3">
                  {group.name}
                </Heading>
                <MultiSelect
                  options={group.items.map((el) => ({
                    value: el,
                    label: el,
                  }))}
                  field={group.key}
                  onChange={(val) => {
                    setForm({ ...form, ...val });
                    navigateTo({ ...form, [group.key]: val[group.key] });
                  }}
                />
              </GridItem>
            ))}
          </Stack>
        </Accordion>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      justifyContent="flex-start"
      position="sticky"
      top="71px"
      background="white"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<BiFilterAlt />}
      />
    </Flex>
  );
};
