import React, { useEffect, useState } from "react";
import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import { activateAccount } from "../services/auth";
import Banner from "../components/Banner";
import { FaChevronLeft } from "react-icons/fa";

export default function Activate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const { mutateAsync, isError } = useMutation(activateAccount, {
    onSuccess: () => navigate("/login"),
    onError: (err) => {
      if (err.response.status === 403 && err.response.data.detail === 'Stale token for given user.') {
        setError('Dieser Benutzer ist bereits aktiviert')
        return
      }
      setError(err.response.data.detail)
    }
  });

  useEffect(() => {
    mutateAsync({ uid, token });
  }, []);
  if (isError) {
    return (
      <>
        <Link to="/" align={"left"}>
          <Button
            m="4"
            variant={"ghost"}
            position={"absolute"}
            leftIcon={<FaChevronLeft />}
          >
            Startseite
          </Button>
        </Link>
        <Stack minH="100vh" align={"center"} justify="center">
        <Banner title={error}/>
        <Link to="/login">
          <Button variant={"primary"}>Einloggen</Button>
        </Link>
      </Stack>
      </>
      
    );
  }

  return (
    <Stack minH="100vh" align={"center"} justify="center">
      <Spinner size={"xl"} color="primary" />
      <Text>Aktivierung...</Text>
    </Stack>
  );
}
