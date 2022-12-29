import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import { TbMoodSmile } from "react-icons/tb";

export default function Banner({ type = "error" }) {
  const showIcon = useCallback(() => {
    switch (type) {
      case "error":
        return {
          icon: <IoMdClose color={"white"} fontSize="3rem" />,
          title: "Oops, something went wrong!",
        };
      default:
        return {
          icon: <TbMoodSmile color={"white"} fontSize="3rem" />,
          title: "Hey!",
        };
    }
  }, [type]);

  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={"red.500"}
          rounded={"50px"}
          w={"55px"}
          h={"55px"}
          textAlign="center"
        >
          {showIcon().icon}
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={2}>
        {showIcon().title}
      </Heading>
    </Box>
  );
}
