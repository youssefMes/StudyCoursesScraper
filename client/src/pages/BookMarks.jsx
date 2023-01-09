import { Heading, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import CoursCard from "../components/CoursCard";
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
        <CoursCard cours={bookmark} key={bookmark.id} />
      ))}
    </Stack>
  );
}
