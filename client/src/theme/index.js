import { extendTheme } from "@chakra-ui/react";
import { Button } from "./components/Button";
import { Input } from "./components/Input"

export const theme = extendTheme({
  colors: {
    primary: "#FFD622",
    secondary: "#6250FE",
    purple: "#A259FF",
    light: "#F9FAFB",
    muted: "#868686",
    primaryLight: "#FFFCED",
    primaryDark: "#e6bb00",
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Button,
    Input
  },
});
