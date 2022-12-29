import { Results, NavBar } from "./components/index";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Footer from "./Footer/Footer";
import LandingPage from "./pages/LandingPage";
import AuthProvider from "./context/authProvider";
import CoursPage from "./pages/CoursPage";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="search"
          element={
            // <AuthProvider>
              <Results />
            // </AuthProvider>
          }
        />
        <Route
          path="courses/:courseId"
          element={
            // <AuthProvider>
              <CoursPage />
            // </AuthProvider>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
