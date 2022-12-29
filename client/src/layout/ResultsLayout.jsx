import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { BiFilterAlt, BiMinus, BiPlus } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { checkboxGroupItems } from "../utils/fakeData";
import CheckboxGroup from "../components/CheckboxGroup";

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
  const [form, setForm] = useState({});
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
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
              name="keyword"
              variant="primary"
              onChange={onChange}
            />
          </InputGroup>
          <Button variant={"primary"}>Suchen</Button>
        </HStack>
        <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
          <Stack divider={<StackDivider borderColor={"blackAlpha.300"} />}>
            {checkboxGroupItems.map((group) => (
              <AccordionItem key={group.name} border="none">
                {({ isExpanded }) => (
                  <>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontWeight="bold"
                      >
                        {group.groupTitle}
                      </Box>
                      {isExpanded ? (
                        <BiMinus fontSize="12px" />
                      ) : (
                        <BiPlus fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <CheckboxGroup
                        options={group.options}
                        onChange={onChange}
                        name={group.name}
                      />
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
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
