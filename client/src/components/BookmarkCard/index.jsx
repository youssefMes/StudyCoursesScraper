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
import { MdDelete } from "react-icons/md";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { useAuthProvider } from "../../context/authProvider";
import { RateTag } from "../../pages/Results";
import { deleteBookmarkCours } from "../../services/bookmarks";

export default function BookmarkCard({ bookmark, refetch }) {
  const { mutateAsync, isLoading } = useMutation(deleteBookmarkCours);

  const { data } = useAuthProvider();

  const deleteBookmark = async () => {
    await mutateAsync({
      id: bookmark.id,
    });
    refetch();
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
          src={bookmark.logo || "/Rectangle 14.png"}
          alt={bookmark.course_name}
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
                {bookmark?.university}
              </Text>
              <IconButton
                bgColor={"red"}
                color={"white"}
                variant="primary"
                icon={<MdDelete />}
                aria-label="bookmark cours"
                size="sm"
                display={data ? "flex" : "none"}
                onClick={deleteBookmark}
                isLoading={isLoading}
              />
            </HStack>
            <Link to={`/courses/${bookmark.course}`}>
              <Heading
                as="h1"
                fontWeight={"bold"}
                fontSize="2xl"
                noOfLines={3}
                wordBreak="break-word"
              >
                {bookmark.course_name}
              </Heading>
            </Link>
          </Stack>
        </Stack>
      </GridItem>
    </Grid>
  );
}
