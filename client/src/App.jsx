import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { NavBar, Footer } from "./components/index";
import {
  LandingPage,
  CoursPage,
  Results,
  Activate,
  Login,
  Register,
  BookMarks,
} from "./pages/index";
import AuthProvider, { useAuthProvider } from "./context/authProvider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="search" element={<Results />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="activate" element={<Activate />} />
          <Route path="courses/:courseId" element={<CoursPage />} />
          <Route
            path="bookmarks"
            element={
              <Protected>
                <BookMarks />
              </Protected>
            }
          />
        </Routes>
      </AuthProvider>
      <Footer />
    </BrowserRouter>
  );
};

function Protected({ children }) {
  const { data, isLoading } = useAuthProvider();
  if (localStorage.getItem("token") && isLoading) {
    return <p>Loading...</p>;
  }
  if (!data) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
