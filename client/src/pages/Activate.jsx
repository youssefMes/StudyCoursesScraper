import React, { useEffect } from "react";
import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import { activateAccount } from "../services/auth";
import Banner from "../components/Banner";

export default function Activate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const { mutateAsync, isError } = useMutation(activateAccount, {
    onSuccess: () => navigate("/login"),
  });

  useEffect(() => {
    mutateAsync({ uid, token });
  }, []);

  if (isError) {
    return (
      <Stack minH="100vh" align={"center"} justify="center">
        <Banner />
        <Link to="/register">
          <Button variant={"primary"}>Register</Button>
        </Link>
      </Stack>
    );
  }

  return (
    <Stack minH="100vh" align={"center"} justify="center">
      <Spinner size={"xl"} color="primary" />
      <Text>Activating...</Text>
    </Stack>
  );
}
