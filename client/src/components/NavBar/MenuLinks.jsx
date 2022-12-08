import { Box, Button, Stack } from "@chakra-ui/react";
import MenuItem from "./MenuItem";
const MenuLinks = () => {
  const isOpen = false;
  return (
    <Box
      display={{ base: "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/login">
          <Button bg="transparent">Einloggen</Button>{" "}
        </MenuItem>
        <MenuItem to="/">
          <Button bg="yellow">Registrieren</Button>{" "}
        </MenuItem>
      </Stack>
    </Box>
  );
};
export default MenuLinks;
