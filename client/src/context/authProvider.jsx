import { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { loadUser } from "../services/auth";

const auth = createContext({});

export const useAuthProvider = () => useContext(auth);

const AuthProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);
  const { data, remove, refetch, isLoading } = useQuery(["user"], loadUser, {
    refetchOnWindowFocus: false,
    enabled: Boolean(localStorage.getItem("token")),
    onSuccess: (res) => {
      setBookmarks(res.bookmarked_courses);
      setUser(res);
    },
  });

  const addNewBookmark = (courseId) => {
    setBookmarks([...bookmarks, courseId]);
  };
  const deleteNewBookmark = (courseId) => {
    setBookmarks(bookmarks.filter((course) => course !== courseId));
  };

  const logout = () => {
    remove();
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <auth.Provider
      value={{
        data,
        user,
        remove,
        isLoading,
        refetch,
        bookmarks,
        addNewBookmark,
        deleteNewBookmark,
        logout,
      }}
    >
      {children}
    </auth.Provider>
  );
};

export default AuthProvider;
