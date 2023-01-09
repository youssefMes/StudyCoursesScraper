import { Heading, HStack, Stack, StackDivider, Text } from "@chakra-ui/react";
import usePagination from "../../hooks/usePagination";
import Comment from "../Comment";
import Pagination from "../Pagination";
import PercentageSlider from "./subComponents/Slider";
import ReactStars from "react-rating-stars-component";

export default function BewertungenTab({ comments, percentages, stars }) {
  const { currentPage, items, noOfPages, goToPageNumber } = usePagination({
    data: comments,
    count: 5,
  });

  return (
    <Stack spacing={6}>
      <Stack
        align={"center"}
        bg="light"
        rounded="xl"
        px="16"
        py="6"
        spacing={2}
        w="2xl"
        mx="auto"
        mt="4"
      >
        <Heading fontWeight="light" fontSize={"3xl"}>
          Weiterempfelungsrate
        </Heading>
        <PercentageSlider value={Number(percentages?.[0]?.value ?? "0")} />
      </Stack>
      <Stack
        align={"center"}
        bg="light"
        rounded="xl"
        px="16"
        py="6"
        spacing={2}
      >
        <Rates items={stars} />
      </Stack>

      <Stack bg="light" rounded="xl" p="6" spacing={6}>
        {items.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        <Pagination
          noOfPages={noOfPages}
          currentPage={currentPage}
          goToPageNumber={goToPageNumber}
        />
      </Stack>
    </Stack>
  );
}

const Rates = ({ items }) => {
  return (
    <Stack
      alignSelf={"stretch"}
      spacing={0}
      divider={<StackDivider borderColor={"gray.200"} />}
    >
      {items.map((item) => (
        <Stack
          direction={{ base: "column", md: "row" }}
          key={item.id}
          justify="space-between"
          pt="3"
        >
          <Text>{item.name}</Text>
          <HStack>
            <ReactStars
              count={5}
              size={24}
              isHalf={true}
              edit={false}
              value={Number(item.value)}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
            ,<Text>{item.value}</Text>
          </HStack>
        </Stack>
      ))}
    </Stack>
  );
};
