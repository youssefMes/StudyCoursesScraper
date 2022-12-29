import { useState } from "react";
import {
  Box,
  Collapse,
  HStack,
  Icon,
  IconButton,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { isHTML } from "../../utils/isHtml";
import { BiChevronDown } from "react-icons/bi";

const InformationRow = ({ title, content, icon, isArray }) => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const renderContent = () => {
    if (isArray) {
      return (
        <UnorderedList pl="14">
          {content.map((item, index) => (
            <ListItem key={index}>
              <Box as="span" dangerouslySetInnerHTML={{ __html: item }} />
            </ListItem>
          ))}
        </UnorderedList>
      );
    }

    if (isHTML(content)) {
      return <Box as="span" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return (
      <Text mt="1" pl="10">
        {content}
      </Text>
    );
  };

  return (
    <HStack
      align={"flex-start"}
      _hover={{ bg: "#f4f4f4" }}
      bg={show ? "#f4f4f4" : "transparent"}
      rounded="xl"
      p="2"
    >
      <Stack spacing={-1} flex={1}>
        <HStack color="secondary">
          <Icon as={icon} color="primaryDark" fontSize={"3xl"} />
          <Text fontWeight="bold" fontSize={"xl"}>
            {title}:
          </Text>
        </HStack>
        {isHTML(content) ? (
          <Collapse startingHeight={100} in={show}>
            <HStack align={"flex-start"} justify={"space-between"} pl="10">
              <Text mt="1">{renderContent()}</Text>
              <IconButton
                variant={"ghost"}
                _hover={{ bg: "#f4f4f4" }}
                onClick={handleToggle}
                icon={<BiChevronDown />}
                fontSize="2xl"
                aria-label="show more"
              />
            </HStack>
          </Collapse>
        ) : (
          renderContent()
        )}
      </Stack>
    </HStack>
  );
};

export default InformationRow;
