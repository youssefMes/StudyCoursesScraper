import { Flex, Button, Stack } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import MenuLinks from "./MenuLinks";

const NavBar = ({ ...props }) => {
  return (
    <Flex
      boxShadow={"lg"}
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      h="50%"
      mb={8}
      p={8}
      bg={["white"]}
      color={["black"]}
      {...props}
    >
      <Logo />
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MenuLinks />
      </Stack>
    </Flex>
  );
};

export default NavBar;
