import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { NavBar, Footer } from "./components/index";
import Activate from "./pages/Activate";
import { LandingPage, Results, CoursPage } from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider, { useAuthProvider } from "./context/authProvider";
import BookMarks from "./pages/BookMarks";

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
  const { data } = useAuthProvider();
  if (!data) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
