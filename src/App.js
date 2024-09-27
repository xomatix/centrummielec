import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home/Home"; // Import your existing components
import Offers from "./Offers/Offers"; // Import the Offers component
import Offer from "./Offer/Offer";
import Login from "./Login/Login";
import EditOffer from "./Offer/EditOffer";
import { RefreshToken } from "./Login/Login";
import { useEffect } from "react";
import { baseApiUrl } from "./Variables";
import Footer from "./Footer/Footer";
import Contact from "./Contact/Contact";
import NavbarComponent from "./Navbar/NavbarComponent";

function App() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      RefreshToken();
      //console.log("Refresh token fuinction start");
    }, 120 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div>
        {/* Navigation bar 2 */}
        <NavbarComponent />

        {/* Route configuration */}
        <Routes>
          <Route path="/" exact element={<Home />} /> {/* Home page */}
          <Route path="/login/" element={<Login />} /> {/* Offers page */}
          <Route path="/kontakt" element={<Contact />} /> {/* Offers page */}
          {localStorage.getItem("token") !== null && (
            <Route path="/dodaj/" element={<EditOffer />} />
          )}
          <Route path="/:category/wynajem" element={<Offers rent={true} />} />
          <Route path="/:category/mielec" element={<Offers mielec={true} />} />
          <Route
            path="/:category/poza-mielcem"
            element={<Offers mielec={false} />}
          />
          <Route path="/:category/" element={<Offers />} />
          <Route path="/:category/:id" element={<Offer />} />{" "}
          {/* Offers page */}
          <Route path="/:category/:id/edytuj" element={<EditOffer />} />{" "}
          {/* Offers page */}
        </Routes>
      </div>

      {/* footer */}
      <Footer />
    </Router>
  );
}

export default App;
