import { Heading, Spinner, Stack } from "@chakra-ui/react";
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
    <Stack>
      <Heading color="secondary">Merkliste</Heading>
      {bookmarks.results.map((bookmark) => (
        <BookmarkCard cours={bookmark} key={bookmark.id} />
      ))}
    </Stack>
  );
}
