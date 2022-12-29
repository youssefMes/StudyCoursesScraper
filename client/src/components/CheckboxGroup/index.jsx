import {
  HStack,
  Stack,
  Text,
  chakra,
  Heading,
  Checkbox,
  useCheckbox,
  useCheckboxGroup,
} from "@chakra-ui/react";

export default function CheckboxGroup({
  groupTitle,
  options = [{ value: "value", label: "label" }],
  name = "",
  onChange
}) {
  function CustomRadio(props) {
    const { label, ...radioProps } = props;
    const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
      useCheckbox(radioProps);

    return (
      <chakra.label {...htmlProps} cursor="pointer">
        <input {...getInputProps({})} hidden />
        <HStack {...getCheckboxProps()} p={1} rounded="full">
          <Checkbox
            isChecked={state.isChecked}
            colorScheme="yellow"
          />
          <Text
            fontWeight={state.isChecked ? "medium" : "normal"}
            {...getLabelProps()}
          >
            {label}
          </Text>
        </HStack>
      </chakra.label>
    );
  }

  const handleChange = (value) => {
    onChange({target: {value, name}});
  };

  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue: "",
    onChange: handleChange,
  });

  return (
    <Stack>
      {groupTitle && <Heading as="h3" fontSize="lg">
        {groupTitle}
      </Heading>}
      <Stack>
        {options.map((avatar) => {
          return (
            <CustomRadio
              key={avatar.value}
              label={avatar.label}
              {...getCheckboxProps({ value: avatar.value })}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
