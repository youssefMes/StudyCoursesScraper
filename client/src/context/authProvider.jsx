import { Heading, Stack } from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout";
import { loadUser } from "../services/auth";

const auth = createContext({});

export const useAuthProvider = () => useContext(auth);

const AuthProvider = ({ children }) => {
  const { isLoading, data, isSuccess, remove, isError, error } = useQuery(
    ["user"],
    loadUser,
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(localStorage.getItem("token")),
      retry: false,
    }
  );
  if (isLoading) {
    return <h1>...loading</h1>;
  }
  if (isSuccess) {
    return <auth.Provider value={{ data, remove }}>{children}</auth.Provider>;
  }

  if (
    !localStorage.getItem("token") ||
    (isError && error.response.status === 401)
  ) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return (
    <HomeLayout>
      <Stack
        align={"center"}
        justify="center"
        flexDirection={"row"}
        minH={"calc(100vh - 104px)"}
      >
        <Heading>Oops, something went wrong!</Heading>
      </Stack>
    </HomeLayout>
  );
};

export default AuthProvider;
