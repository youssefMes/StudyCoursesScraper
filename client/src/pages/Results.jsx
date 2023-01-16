import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useSearchParams, useLocation } from "react-router-dom";
import ResultsLayout from "../layout/ResultsLayout";
import { searchCourses } from "../services/courses";
import Banner from "../components/Banner";
import { BsStar } from "react-icons/bs";
import CoursCard from "../components/CoursCard";
import { useEffect, useState } from "react";
import { useAuthProvider } from "../context/authProvider";

export default function Results() {
  const [courses, setCourses] = useState({ results: [] });
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams({});
  const search = searchParams.get("search");
  const study_forms = searchParams.get("study_forms");
  const degrees = searchParams.get("degrees");
  const languages = searchParams.get("languages");
  const cities = searchParams.get("cities");
  const portals = searchParams.get("portals");
  const { data, refetch } = useAuthProvider();
  const {
    isLoading,
    isFetching,
    isError,
    isPreviousData
  } = useQuery(
    [search, page, study_forms, degrees, languages, cities, portals],
    () =>
      searchCourses({
        study_forms: study_forms ? study_forms.split(",") : undefined,
        degrees: degrees ? degrees.split(",") : undefined,
        languages: languages ? languages.split(",") : undefined,
        cities: cities ? cities.split(",") : undefined,
        portals: portals ? portals.split(",") : undefined,
        search: search ? search : "",
        page,
      }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess: (response) => {
          setCourses(response);
      },
    }
  );
  useEffect(() => {
    if (data) {
      refetch();
    }
  }, []);
  if (isLoading) {
    return (
      <ResultsLayout>
        <Flex justify="center">
          <Spinner />
        </Flex>
      </ResultsLayout>
    );
  }
  if (isError) {
    return (
      <ResultsLayout>
        <Flex justify="center">
          <Banner type="error" />
        </Flex>
      </ResultsLayout>
    );
  }
  return (
    <ResultsLayout>
      <Container maxW="8xl" mb="8">
        <Text>{courses.count} Ergebnisse {search && 'für'}</Text>
        <Heading as="h1" color="secondary" fontWeight="normal" fontSize={'4xl'} mb="8">
          {search ? search : ""}
        </Heading>
        <Stack spacing={6}>
          {courses.results.map((cours) => (
            <CoursCard cours={cours} key={cours.id} />
          ))}
          {isFetching && (
            <Center>
              <Spinner size={"md"} color="gold-yellow" />
            </Center>
          )}
          <Stack spacing={4} direction={['column', 'row']} justify={"center"}>
            {courses.previousPage && !isFetching && (
              <Button
                alignSelf={"center"}
                variant="primary"
                onClick={() => setPage((prevState) => prevState - 1)}
              >
                Vorherige Seite
              </Button>
            )}
            {courses.nextPage && !isFetching && (
              <Button
                alignSelf={"center"}
                variant="primary"
                onClick={() => setPage((prevState) => prevState + 1)}
              >
                Nächste Seite
              </Button>
            )}
            <Text fontSize={"15px"}  align='center' orientation='vertical' style={{padding: "10px"}}>(Seite {page})</Text>
          </Stack>
        </Stack>
      </Container>
    </ResultsLayout>
  );
}

export const RateTag = ({ rating = 4.8 }) => (
  <Tag
    bg="primary"
    color="black"
    alignSelf={"flex-start"}
    gap="5px"
    alignItems={"center"}
    display="flex"
  >
    <Text as="span" lineHeight="normal">
      {rating}
    </Text>{" "}
    <BsStar fontSize={"12px"} />
  </Tag>
);
