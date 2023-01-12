import { Heading, Spinner, Stack, Container, Box } from "@chakra-ui/react";
import { useQuery } from "react-query";
import BookmarkCard from "../components/BookmarkCard";
import { fetchBookmarks } from "../services/bookmarks";

export default function BookMarks() {
  const { data: bookmarks, isLoading } = useQuery("bookmarks", fetchBookmarks);

  if (isLoading) {
    return (
      <Stack minH={"100vh"} align="center" justify="center">
        <Spinner color="primary" size="xl" />
      </Stack>
    );
  }

  return (
    <Box minH="100vh" bg={"white"} paddingTop={"72px"}>
      <Box p="4" pt="8">
        <Container maxW="8xl" mb="8">
          <Heading
            as="h1"
            color="secondary"
            fontWeight="bold"
            mb="8"
            textAlign="center"
          >
            Merkliste
          </Heading>
          <Stack spacing={6}>
            {bookmarks.results.map((bookmark) => (
              <BookmarkCard bookmark={bookmark} key={bookmark.id} />
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      justifyContent="flex-start"
      position="sticky"
      top="71px"
      background="white"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<BiFilterAlt />}
      />
    </Flex>
  );
};
