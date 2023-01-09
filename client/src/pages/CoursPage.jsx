import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { fetchCourse } from "../services/courses";
import Banner from "../components/Banner";
import InformationTab from "../components/InformationTab";
import BewertungenTab from "../components/BewertungenTab";
import When from "../components/When";

export default function CoursPage() {
  const { courseId } = useParams();
  const {
    data: cours,
    isLoading,
    isError,
  } = useQuery([courseId], () => fetchCourse(courseId));

  if (isLoading) {
    return (
      <Container maxW="7xl">
        <Spinner />
      </Container>
    );
  }
  if (isError) {
    return (
      <Container maxW="7xl">
        <Banner type="error" />
      </Container>
    );
  }

  const isStudyCheck = cours.portal.name === "studyCheck";
  const haveComments = cours?.evaluation_count > 0;

  return (
    <Container maxW="7xl" pt="32">
      <Stack spacing={8}>
        <Box bg="purple" rounded="xl" p="0">
          <Grid
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap="0"
            overflow="hidden"
            minH="400px"
          >
            <GridItem p="4" display={"flex"} justifyContent="center">
              <Stack color="white" justify={"center"} align="flex-start">
                <Text fontWeight={500}>{cours.information.university}</Text>
                <Heading fontWeight="light">{cours.name}</Heading>
                <Text fontWeight={"bold"}>{cours.information.degree}</Text>
              </Stack>
            </GridItem>
            <GridItem rounded={"xl"}>
              <Image
                src={cours.logo?.image || '/Rectangle 14.png'}
                alt={cours.name}
                width="full"
                height="full"
                rounded="xl"
                objectFit="cover"
                objectPosition="left"
              />
            </GridItem>
          </Grid>
        </Box>
        {cours.is_valid ? <ValidAlert /> : <InValidAlert />}
        <Tabs variant="line" isFitted size={"lg"}>
          <TabList>
            <Tab _selected={{ borderColor: "purple", color: "purple" }}>
              Informationen
            </Tab>
            <Tab
              _selected={{ borderColor: "purple", color: "purple" }}
              isDisabled={!haveComments}
            >
              Bewertungen
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <InformationTab
                isStudyCheck={isStudyCheck}
                information={cours.information}
                portal={cours.portal.name}
              />
            </TabPanel>
            <TabPanel>
              <BewertungenTab
                comments={cours?.comments}
                percentages={cours.percentages}
                stars={cours?.stars}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

const InValidAlert = ({ invalidated_by }) => (
  <Alert
    status="info"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="200px"
    rounded="xl"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      Informationen validieren!
    </AlertTitle>
    <AlertDescription maxWidth="sm">
      <When condition={Boolean(invalidated_by)}>
        <Text>
          Die Informationen wurden von{" "}
          {invalidated_by?.first_name + " " + invalidated_by?.last_name}{" "}
          ungültig markiert
        </Text>
      </When>
      <When condition={!Boolean(invalidated_by)}>
        <Text>
          Hier können Sie die Informationen überprüfen und dann validieren
        </Text>
      </When>
    </AlertDescription>
    <Button variant={"ghost"} bg="white">
      Validieren
    </Button>
  </Alert>
);
const ValidAlert = ({ validated_by }) => (
  <Alert
    status="success"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="200px"
    rounded="xl"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      Informationen ungültich machen!
    </AlertTitle>
    <AlertDescription maxWidth="sm">
      <When condition={Boolean(validated_by)}>
        <Text>
          Die Informationen wurden von{" "}
          {validated_by?.first_name + " " + validated_by?.last_name} validiert
        </Text>
      </When>
    </AlertDescription>
    <Button variant={"ghost"} bg="white">
      Ungültig machen
    </Button>
  </Alert>
);
