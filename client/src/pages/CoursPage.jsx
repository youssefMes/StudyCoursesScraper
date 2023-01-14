import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
  useToast,
} from "@chakra-ui/react";
import {
  fetchCourse,
  inValidateCourse,
  validateCourse,
} from "../services/courses";
import Banner from "../components/Banner";
import InformationTab from "../components/InformationTab";
import BewertungenTab from "../components/BewertungenTab";
import When from "../components/When";
import { useAuthProvider } from "../context/authProvider";

export default function CoursPage() {
  const { courseId } = useParams();
  const {
    data: cours,
    isLoading,
    isError,
  } = useQuery(`course-${courseId}`, () => fetchCourse(courseId));
  const { user } = useAuthProvider();

  if (isLoading) {
    return (
      <Container
        maxW="7xl"
        minHeight={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner size={"xl"} />
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
        <Box bg="purple" rounded="xl" p="0" overflow={"hidden"}>
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
                src={cours.logo?.image}
                alt={cours.name}
                fallback={
                  <Image
                    src="/university_placeholder.png"
                    width="100%"
                    height="100%"
                    maxHeight="400px"
                    objectFit="cover"
                    objectPosition={"left"}
                  />
                }
                width="full"
                height="full"
                rounded="xl"
                objectFit="cover"
                objectPosition="left"
              />
            </GridItem>
          </Grid>
        </Box>
        <When condition={user?.is_staff}>
          {cours.is_valid ? (
            <ValidAlert
              courseId={cours.id}
              validated_by={cours?.validated_by}
            />
          ) : (
            <InValidAlert
              courseId={cours.id}
              invalidated_by={cours?.invalidated_by}
            />
          )}
        </When>
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

const InValidAlert = ({ invalidated_by, courseId }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(validateCourse, {
    onSuccess: () => queryClient.invalidateQueries(`course-${courseId}`),
    onError: () =>
      toast({
        description: "Etwas ist schief gelaufen",
        status: "error",
        duration: 3000,
        position: "top-right",
      }),
  });

  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="250px"
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
            <Text as="span" fontWeight={"bold"}>
              {invalidated_by?.first_name + " " + invalidated_by?.last_name}
            </Text>{" "}
            ungültig markiert
          </Text>
        </When>
        <When condition={!Boolean(invalidated_by)}>
          <Text>
            Hier können Sie die Informationen überprüfen und dann validieren
          </Text>
        </When>
      </AlertDescription>
      <Button
        variant={"ghost"}
        bg="white"
        onClick={() => mutateAsync(courseId)}
        isLoading={isLoading}
        mt="3"
      >
        Validieren
      </Button>
    </Alert>
  );
};
const ValidAlert = ({ validated_by, courseId }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(inValidateCourse, {
    onSuccess: () => queryClient.invalidateQueries(`course-${courseId}`),
    onError: () =>
      toast({
        description: "Etwas ist schief gelaufen",
        status: "error",
        duration: 3000,
        position: "top-right",
      }),
  });
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="250px"
      rounded="xl"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Informationen ungültig machen!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        <When condition={Boolean(validated_by)}>
          <Text>
            Die Informationen wurden von{" "}
            <Text as="span" fontWeight={"bold"}>
              {validated_by?.first_name + " " + validated_by?.last_name}
            </Text>{" "}
            validiert
          </Text>
        </When>
      </AlertDescription>
      <Button
        variant={"ghost"}
        bg="white"
        onClick={() => mutateAsync(courseId)}
        isLoading={isLoading}
        mt="3"
      >
        Ungültig machen
      </Button>
    </Alert>
  );
};
