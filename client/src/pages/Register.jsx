import React, { useState } from "react";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Field from "../components/Field";
import SplitScreen from "../layout/SplittedScreen";
import { register } from "../services/auth";
import { Link } from "react-router-dom";

const registerFields = [
  {
    type: "text",
    name: "first_name",
    placeholder: "Vorname",
    rules: {
      required: "Bitte geben Sie Ihren Vornamen ein",
    },
  },
  {
    type: "text",
    name: "last_name",
    placeholder: "Nachname",
    rules: {
      required: "Bitte geben Sie Ihren Nachnamen ein",
    },
  },
  {
    type: "text",
    name: "email",
    placeholder: "Email Addresse",
    rules: {
      required: "Bitte geben Sie Ihre Email-Addresse ein",
    },
  },
  {
    type: "password",
    name: "password",
    placeholder: "Passwort",
    rules: {
      required: "Bitte geben Sie Ihr Passwort ein",
    },
  },
  {
    type: "password",
    name: "re_password",
    placeholder: "Passwort wiederholen",
    rules: {
      required: "Bitte wiederholen Sie Ihr Passwort",
    },
  },
];

export default function Register() {
  const [errors, setErrors] = useState([]);
  const methods = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      re_password: "",
    },
  });

  const { mutateAsync, isLoading, isSuccess } = useMutation(register, {
    onError: (err) => setErrors(Object.entries(err.response.data)),
  });

  const onsubmit = (data) => {
    setErrors([]);
    mutateAsync(data);
  };

  return (
    <SplitScreen title={!isSuccess && "Registrierung"}>
      {!isSuccess ? (
        <FormProvider {...methods}>
          <Stack
            as="form"
            spacing={6}
            onSubmit={methods.handleSubmit(onsubmit)}
          >
            {registerFields.map((field) => (
              <Field
                {...field}
                key={field.name}
                error={errors.find((el) => el[0] === field.name)}
              />
            ))}
            <Stack
              direction={{ base: "column", md: "row" }}
              justify="space-between"
            >
              <Link to="/login">
                <Button
                  variant="link"
                  textDecoration="underline"
                  disabled={isLoading}
                >
                  Sind Sie schon registriert ?
                </Button>
              </Link>
              <Button variant="primary" type="submit" isLoading={isLoading}>
                Anmelden
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      ) : (
        <Stack align={"center"} textAlign="center">
          <Heading>Email Sent</Heading>
          <Text>
            To access your account, we sent you an email to verify your account.
          </Text>
        </Stack>
      )}
    </SplitScreen>
  );
}
