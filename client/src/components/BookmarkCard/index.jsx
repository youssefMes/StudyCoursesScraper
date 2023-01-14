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
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useAuthProvider } from "../../context/authProvider";
import { deleteBookmarkCours } from "../../services/bookmarks";

export default function BookmarkCard({ bookmark }) {
  const queryClient = useQueryClient();
  const { data, deleteNewBookmark } = useAuthProvider();

  const { mutateAsync, isLoading } = useMutation(deleteBookmarkCours, {
    onSuccess: () => queryClient.invalidateQueries(`bookmarks`),
  });

  const deleteBookmark = async () => {
    await mutateAsync({
      id: bookmark.id,
    });
    deleteNewBookmark(bookmark.course);
  };

  return (
    <Grid
      gridTemplateColumns={{
        base: "1fr",
        md: "minmax(100px, 0.05fr) 1fr",
      }}
      bg="light"
      rounded={"xl"}
      p="4"
      gap="4"
      minHeight={"130px"}
      key={Math.random()}
    >
      <GridItem>
        <Image
          src={bookmark.logo}
          alt={bookmark.course_name}
          fallback={<Image src="/university_placeholder.png" width="100%" maxHeight={{ base: "200px", md: "100px" }} objectFit="contain" objectPosition={"left"} rounded="lg"/>}
          width="100%"
          maxHeight={{ base: "200px", md: "100px" }}
          objectFit={"contain"}
          objectPosition={{ base: "center", md: "left" }}
          rounded="lg"
        />
      </GridItem>
      <GridItem>
        <Stack spacing={8}>
          <Stack spacing={0}>
            <HStack justifyContent={"space-between"}>
              <Text color="muted" fontWeight={400}>
                {bookmark?.university}
              </Text>
              <IconButton
                bgColor={"red.500"}
                _hover={{ bg: "red.600" }}
                color={"white"}
                variant="primary"
                icon={<MdDelete />}
                fontSize="xl"
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
