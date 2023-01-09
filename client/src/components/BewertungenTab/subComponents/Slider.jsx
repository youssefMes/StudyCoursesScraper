import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderTrack,
} from "@chakra-ui/react";
import { useCallback } from "react";

export default function PercentageSlider({ value }) {
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const bgColor = useCallback(() => {
    if (value < 40) {
      return "red.500";
    } else if (value >= 40 && value < 75) {
      return "orange.500";
    } else if (value >= 75) {
      return "green.500";
    }
  }, [value]);

  return (
    <Box pt={6} pb={2} alignSelf="stretch">
      <Slider aria-label="Weiterempfelungsrate" value={value} size="lg">
        <SliderMark value={25} {...labelStyles}>
          25%
        </SliderMark>
        <SliderMark value={50} {...labelStyles}>
          50%
        </SliderMark>
        <SliderMark value={75} {...labelStyles}>
          75%
        </SliderMark>
        <SliderMark
          value={value}
          textAlign="center"
          bg={bgColor()}
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {value}%
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack bg={bgColor()} />
        </SliderTrack>
      </Slider>
    </Box>
  );
}
