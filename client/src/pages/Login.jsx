import React, { useState } from "react";
import { Stack, Button, useToast } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Field from "../components/Field";
import SplitScreen from "../layout/SplittedScreen";
import { loadUser, login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

const registerFields = [
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
];

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync: loadLoggedInUser } = useMutation(loadUser);

  const { mutateAsync, isLoading } = useMutation(login, {
    onError: (err) =>
      toast({
        variant: "solid",
        status: "error",
        description: err.response.data.detail,
        position: "top-right",
        duration: 4000,
      }),
    onSuccess: (res) => {
      localStorage.setItem("token", res.access);
      loadLoggedInUser();
      navigate("/");
    },
  });

  const onsubmit = (data) => {
    mutateAsync(data);
  };

  return (
    <SplitScreen title={"Sign in"}>
      <FormProvider {...methods}>
        <Stack as="form" spacing={6} onSubmit={methods.handleSubmit(onsubmit)}>
          {registerFields.map((field) => (
            <Field {...field} key={field.name} />
          ))}
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
          >
            <Link to="/register">
              <Button
                variant="link"
                textDecoration="underline"
                disabled={isLoading}
              >
                Haben Sie noch kein Konto ?
              </Button>
            </Link>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Einloggen
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </SplitScreen>
  );
}
