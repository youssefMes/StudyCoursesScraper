import {
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Spinner,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import ResultsLayout from "../layout/ResultsLayout";
import { searchCourses } from "../services/courses";
import Banner from "../components/Banner";
import { BsStar, BsBookmark } from "react-icons/bs";

export default function Results() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const keyword = searchParams.get("q");
  const abschluss = searchParams.get("abschluss");
  const studienbeginn = searchParams.get("studienbeginn");
  const zulassungsmodus = searchParams.get("zulassungsmodus");

  const {
    data: data,
    isLoading,
    isError,
  } = useQuery([keyword], () =>
    searchCourses({
      keyword,
      abschluss,
      studienbeginn,
      zulassungsmodus,
    })
  );

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
      <Container maxW="8xl">
        <Text>{data.results?.length} Ergebnisse für</Text>
        <Heading as="h1" color="secondary" fontWeight="normal" mb="8">
          {keyword ?? "Medieninformatik"}
        </Heading>
        <Stack spacing={6}>
          {data.results.map((cours) => (
            <Grid
              key={cours.id}
              gridTemplateColumns={{
                base: "1fr",
                md: "minmax(200px, 0.25fr) 1fr",
              }}
              bg="light"
              rounded={"xl"}
              p="4"
              gap="8"
            >
              <GridItem>
                <Image
                  src="/Rectangle 14.png"
                  alt="bla bla"
                  width="100%"
                  maxHeight="250px"
                  objectFit="contain"
                />
              </GridItem>
              <GridItem>
                <Stack spacing={8}>
                  <Stack>
                    <HStack justifyContent={"space-between"}>
                      <Text color="muted" fontWeight={400}>
                        {cours.information.university}
                      </Text>
                      <IconButton
                        variant="primary"
                        icon={<BsBookmark />}
                        aria-label="bookmark cours"
                        size="sm"
                      />
                    </HStack>
                    <Link to={`/courses/${cours.id}`}>
                      <Heading
                        as="h1"
                        fontWeight={"bold"}
                        fontSize="2xl"
                        noOfLines={3}
                        wordBreak="break-word"
                      >
                        {cours.name}
                      </Heading>
                    </Link>
                  </Stack>
                  <Stack>
                    <Text color="muted" fontWeight={600} opacity={0.7}>
                      {cours.information.degree}
                    </Text>
                    <Tag
                      bg="primary"
                      color="black"
                      alignSelf={"flex-start"}
                      gap="5px"
                      alignItems={"center"}
                      display="flex"
                    >
                      <Text as="span" lineHeight="normal">
                        4.8
                      </Text>{" "}
                      <BsStar fontSize={"12px"} />
                    </Tag>
                  </Stack>
                </Stack>
              </GridItem>
            </Grid>
          ))}
        </Stack>
      </Container>
    </ResultsLayout>
  );
}
