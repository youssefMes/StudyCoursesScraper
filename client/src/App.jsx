import { LandingPage, Results, NavBar } from "./components/index";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Footer from "./Footer/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
