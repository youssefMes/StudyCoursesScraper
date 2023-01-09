import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import _ from "lodash";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";

export default function PasswordField({
  name,
  label,
  rules,
  placeholder,
  hidden = false,
  disabled = false,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { control, watch } = useFormContext();
  const { errors } = useFormState({ control });

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={_.get(watch(), name)}
        render={({ field: { ref, ...rest } }) => (
          <InputGroup>
            <Input
              bg={
                (!hidden && _.get(errors, name)) || error ? "red.50" : "gray.50"
              }
              hidden={hidden}
              type={showPassword ? "text" : "password"}
              variant={"primary"}
              disabled={disabled}
              placeholder={placeholder}
              {...rest}
              label={label}
              size={"lg"}
              borderRadius={"8px"}
              fontWeight={"normal"}
              _placeholder={{
                fontWeight: "light",
                color: "gray",
                fontSize: { base: "0.9rem", "2xl": "1rem" },
              }}
              borderWidth={
                (!hidden && _.get(errors, name)) || error ? "1px" : "0px"
              }
              borderColor={
                (!hidden && _.get(errors, name)) || error
                  ? "red.100"
                  : "transparent"
              }
              height={{ base: "2.5rem", "2xl": "3rem" }}
            />
            <InputRightElement h="full">
              <Button
                variant={"ghost"}
                fontSize={"xl"}
                p="0"
                h="full"
                borderTopLeftRadius={0}
                borderBottomLeftRadius={0}
                _focus={{ outline: "none" }}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
              </Button>
            </InputRightElement>
          </InputGroup>
        )}
        rules={rules}
      />
      {!hidden && (
        <Text color="red" fontSize="sm">
          {_.get(errors, name) ? _.get(errors, `${name}.message`) : null}
        </Text>
      )}
      {error && (
        <Text color="red" fontSize="sm">
          {error[1]}
        </Text>
      )}
    </div>
  );
}
