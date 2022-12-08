import { LandingPage, Results, NavBar } from "./components/index";
import { Route, BrowserRouter, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/results" element={<Results/>} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
