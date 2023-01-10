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
  AccordionItem,
  AccordionButton,
  AccordionPanel,
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
  Heading
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import { BiFilterAlt, BiMinus, BiPlus } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { checkboxGroupItems } from "../utils/fakeData";
import CheckboxGroup from "../components/CheckboxGroup";
import { useSearchParams } from "react-router-dom";
import { fetchFilters } from "../services/filters";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams({});
  const search = searchParams.get("search");
  const study_forms = searchParams.get("study_forms");
  const degrees = searchParams.get("degrees");
  const languages = searchParams.get("languages");
  const cities = searchParams.get("cities");
  const portals = searchParams.get("portals");
  const [filters, setFilters] = useState({
    checkboxes: [],
    dropdowns: [],
  });
  const navigate = useNavigate();
  const { isLoading: loadingFilters } = useQuery(["filters"], fetchFilters, {
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
    const entries = Array.from(searchParams.entries())
    let value = ''
    let newForm = {}
    for (const [key, val] of entries) {
      value = val
      if (key !== 'search') {
        value = searchParams.get(key).split(',').filter(Boolean)
      }
      if (value) {
        newForm = {...newForm, [key]: value}
      }
    }
    setForm({
      ...form,
      ...newForm
    })
  }, [])

  const onCheckBoxChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    navigateTo({ ...form, [e.target.name]: e.target.value })

  }
  const navigateTo = (form) => {
    const { search, study_forms, cities, portals, languages, degrees } = form;

    navigate({
      pathname: "/search",
      search: `?search=${search}&study_forms=${study_forms}&cities=${cities}&portals=${portals}&degrees=${degrees}&languages=${languages}`,
    });
   }
  return (
    <Box
      bg={"light"}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 80 }}
      pos="fixed"
      h="full"
      p="2"
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
          <Button variant={"primary"} onClick={() => navigateTo(form)}>Suchen</Button>
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
                        : `${group.name} Auswählen`}
                    </MenuButton>
                    <MenuList minWidth="240px" h="200px" overflowY={'scroll'}>
                      <MenuOptionGroup
                        type="checkbox"
                        onChange={(val) => {
                          setForm({ ...form, [group.key]: val })
                          navigateTo({ ...form, [group.key]: val })
                        }}
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
