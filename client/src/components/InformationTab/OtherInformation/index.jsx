import { Grid } from "@chakra-ui/react";
import Studiengaenge from "./Studiengaenge";

export default function OtherInformation({ portal, other_information }) {
  const displayOtherInformation = () => {
    switch (portal) {
      case "studiengaenge.zeit":
        return <Studiengaenge otherInformation={other_information} />;
      default:
        return null;
    }
  };

  return (
    <Grid gridTemplateColumns={{ base: "1fr", md: "1fr" }}>
      {displayOtherInformation()}
    </Grid>
  );
}
