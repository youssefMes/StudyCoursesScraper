import { Badge, Box, Button, Flex, Stack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthProvider } from "../../context/authProvider";
import MenuItem from "./MenuItem";
import { BsBookmarkFill } from "react-icons/bs";

const MenuLinks = () => {
  const navigate = useNavigate();
  const { bookmarks, user, logout } = useAuthProvider();

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

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
        {!user ? (
          <>
            <MenuItem to="/login">
              <Button bg="ghost">Einloggen</Button>{" "}
            </MenuItem>
            <MenuItem to="/register">
              <Button variant={"primary"}>Registrieren</Button>{" "}
            </MenuItem>
          </>
        ) : (
          <Stack direction={{ base: "column", md: "row" }}>
            <Link to="/bookmarks">
              <Button variant={"primary"}>
                <Box position={"relative"} mr="3">
                  <BsBookmarkFill />
                  <Badge
                    bg="red.500"
                    color="white"
                    mr="2"
                    position={"absolute"}
                    top="-6px"
                    rounded={"xl"}
                    display={bookmarks.length === 0 ? "none" : "static"}
                  >
                    {bookmarks.length}
                  </Badge>
                </Box>
                Merkliste
              </Button>
            </Link>
            <Button onClick={logoutUser} variant={"ghost"}>
              Logout
            </Button>
          </Stack>
        )}
      </Stack>
    </Flex>
  );
};
export default MenuLinks;
