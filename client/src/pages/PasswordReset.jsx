import React, {useState} from "react";
import { Stack, Button, useToast, Heading, Text } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Field from "../components/Field";
import SplitScreen from "../layout/SplittedScreen";
import { passworReset } from "../services/auth";

const registerFields = [
  {
    type: "text",
    name: "email",
    placeholder: "Email Adresse",
    rules: {
      required: "Bitte geben Sie Ihre Email Adresse ein",
    },
  },
];

export default function PasswordReset() {
  const [isSent, setIsSent] = useState(false)
  const toast = useToast();
  const methods = useForm({
    defaultValues: {
        email: "",
    },
  });

  const { mutateAsync, isLoading } = useMutation(passworReset, {
    onError: (err) => 
      toast({
        variant: "solid",
        status: "error",
        description: err.response.data[0],
        position: "top-right",
        duration: 4000,
      }),
    onSuccess: () => {
        setIsSent(true);
    },
  });

  const onsubmit = (data) => {
    mutateAsync(data);
  };

  return (
    <SplitScreen title={!isSent ? "Passwort zurücksetzen" : ""}>
      {!isSent 
      ? (<FormProvider {...methods}>
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
      </FormProvider>) 
      : (
        <Stack align={"center"} textAlign="center">
            <Heading>E-Mail gesendet</Heading>
            <Text>
                Wir haben Ihnen eine E-mail geschickt
                Um Ihr Passwort zurückzusetzen, clicken Sie auf die Url.
            </Text>
        </Stack>
      )
      }
    </SplitScreen>
  );
}
