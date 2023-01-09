import { Heading, HStack, Stack, StackDivider, Text } from "@chakra-ui/react";
import React from "react";
import { RateTag } from "../../pages/Results";
import When from "../When";

export default function Comment({ comment }) {
  const { title, star_rating, content, date, additional_evaluation } = comment;
  return (
    <Stack bg="#f4f4f4" rounded="xl" p="4">
      <Stack direction={{ base: "column", md: "row" }} justify="space-between">
        <Stack>
          <Heading
            fontWeight="light"
            textDecoration="underline"
            fontSize={"3xl"}
          >
            {title}
          </Heading>
        </Stack>
        <HStack>
          <RateTag rate={star_rating} />
        </HStack>
      </Stack>
      <Stack divider={Boolean(additional_evaluation) && <StackDivider />}>
        <Text>{content}</Text>
        <When condition={Boolean(additional_evaluation)}>
          <Text fontWeight="bold">{additional_evaluation.question}</Text>
          <Text>{additional_evaluation.answer}</Text>
        </When>
      </Stack>
      <Text color="muted" fontSize="sm" opacity={0.7}>
        {new Intl.DateTimeFormat("de-DE", {
          weekday: "short",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(date))}
      </Text>
    </Stack>
  );
}
