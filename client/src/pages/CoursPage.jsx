import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Box,
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
                src="/Rectangle 14.png"
                alt="Cours image"
                width="full"
                height="full"
                rounded="xl"
                objectFit="cover"
                objectPosition="left"
              />
            </GridItem>
          </Grid>
        </Box>
        <Tabs variant="line" isFitted size={"lg"}>
          <TabList>
            <Tab _selected={{ borderColor: "purple", color: "purple" }}>
              Informationen
            </Tab>
            <Tab
              _selected={{ borderColor: "purple", color: "purple" }}
              isDisabled={!isStudyCheck}
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
              <p>Bewertungen!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}
