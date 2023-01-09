import { Button, HStack } from "@chakra-ui/react";

export default function Pagination({ noOfPages, currentPage, goToPageNumber }) {
  return (
    <HStack justify={"center"} wrap="wrap">
      {[...Array(noOfPages)].map((el, index) => (
        <Button
          key={index}
          bg={currentPage === index + 1 ? "primary" : "light"}
          onClick={() => goToPageNumber(index)}
        >
          {index + 1}
        </Button>
      ))}
    </HStack>
  );
}
