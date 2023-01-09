import {
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { useAuthProvider } from "../../context/authProvider";
import { RateTag } from "../../pages/Results";
import { bookmarkCours } from "../../services/bookmarks";

export default function CoursCard({ cours }) {
  const { mutateAsync, isLoading, isSuccess } = useMutation(bookmarkCours);
  const { data } = useAuthProvider();

  const bookmark = () => {
    mutateAsync({
      userId: data.id,
      id: cours.id,
    });
  };

  return (
    <Grid
      gridTemplateColumns={{
        base: "1fr",
        md: "minmax(200px, 0.25fr) 1fr",
      }}
      bg="light"
      rounded={"xl"}
      p="4"
      gap="8"
      key={Math.random()}
    >
      <GridItem>
        <Image
          src={cours.logo?.image || "/Rectangle 14.png"}
          alt={cours.name}
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
                icon={isSuccess ? <BsBookmarkFill /> : <BsBookmark />}
                aria-label="bookmark cours"
                size="sm"
                display={data ? "flex" : "none"}
                onClick={bookmark}
                isLoading={isLoading}
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
            <RateTag />
          </Stack>
        </Stack>
      </GridItem>
    </Grid>
  );
}
