import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import MenuItem from "./MenuItem";
const MenuLinks = () => {
  const isOpen = false;
  return (
    <Flex
      alignItems="center"
      justifyContent={"space-between"}
      w="full"
      flexBasis={{ base: "100%", md: "auto" }}
      bg="white"
      borderRadius={"md"}

    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        p={[4, 4, 0, 0]}
        flex={1}
      >
        <MenuItem to="/login">
          <Button bg="ghost">Einloggen</Button>{" "}
        </MenuItem>
        <MenuItem to="/">
          <Button variant={"primary"}>Registrieren</Button>{" "}
        </MenuItem>
      </Stack>
    </Flex>
  );
};
export default MenuLinks;
