import { Route, BrowserRouter, Routes } from "react-router-dom";
import { NavBar, Footer } from "./components/index";
import { LandingPage, Results, CoursPage } from "./pages/index";
// import AuthProvider from "./context/authProvider";

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
