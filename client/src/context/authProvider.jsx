import { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { loadUser } from "../services/auth";

const auth = createContext({});

export const useAuthProvider = () => useContext(auth);

const AuthProvider = ({ children }) => {
  const { isLoading, data, remove } = useQuery(["user"], loadUser, {
    refetchOnWindowFocus: false,
    enabled: Boolean(localStorage.getItem("token")),
    // retry: false,

  });
  if (isLoading) {
    return <h1>...loading</h1>;
  }

  return <auth.Provider value={{ data, remove }}>{children}</auth.Provider>;
};

export default AuthProvider;
