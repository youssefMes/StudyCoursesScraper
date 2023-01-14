import React from "react";
import { Stack, Button, useToast } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import Field from "../components/Field";
import SplitScreen from "../layout/SplittedScreen";
import { passworResetConfirm } from "../services/auth";

const registerFields = [
  {
    type: "password",
    name: "new_password",
    placeholder: "Neues Passwort",
    rules: {
      required: "Bitte geben Sie Ihr neues Passwort ein",
    },
  },
  {
    type: "password",
    name: "re_new_password",
    placeholder: "Wiederholung des neuen Passwortes",
    rules: {
      required: "Bitte geben Sie Ihr neues Passwort erneut ein",
    },
  },
];

export default function PasswordResetConfirmation() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const toast = useToast();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
        new_password: "",
        re_new_password: "",
    },
  });

  const { mutateAsync, isLoading } = useMutation(passworResetConfirm, {
    onError: (err) =>
      toast({
        variant: "solid",
        status: "error",
        description: Object.keys(err.response.data)[0] + ':' + Object.values(err.response.data)[0],
        position: "top-right",
        duration: 4000,
      }),
    onSuccess: () => {
      navigate("/login");
    },
  });

  const onsubmit = (data) => {
    mutateAsync({...data, ...{uid, token}});
  };

  return (
    <SplitScreen title={"Passwort zurücksetzen"}>
      <FormProvider {...methods}>
        <Stack as="form" spacing={6} onSubmit={methods.handleSubmit(onsubmit)}>
          {registerFields.map((field) => (
            <Field {...field} key={field.name} />
          ))}
        
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
          >
            <Button variant="primary" type="submit" isLoading={isLoading}>
                Passwort zurücksetzen
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </SplitScreen>
  );
}
