import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import { RefreshToken } from "./Login/Login";
import Footer from "./Footer/Footer";
import NavbarComponent from "./Navbar/NavbarComponent";
import { lazy } from "react";

// Dynamically import components using React.lazy
const Home = lazy(() => import("./Home/Home"));
const Offers = lazy(() => import("./Offers/Offers"));
const Offer = lazy(() => import("./Offer/Offer"));
const Login = lazy(() => import("./Login/Login"));
const EditOffer = lazy(() => import("./Offer/EditOffer"));
const Contact = lazy(() => import("./Contact/Contact"));

function App() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      RefreshToken();
    }, 120 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div>
        {/* Navigation bar */}
        <NavbarComponent />

        {/* Route configuration with Suspense */}
        <Suspense
          fallback={
            <div className="flex justify-center  items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/kontakt" element={<Contact />} />
            {localStorage.getItem("token") !== null && (
              <Route path="/dodaj/" element={<EditOffer />} />
            )}
            <Route path="/:category/wynajem" element={<Offers rent={true} />} />
            <Route
              path="/:category/mielec"
              element={<Offers mielec={true} />}
            />
            <Route
              path="/:category/poza-mielcem"
              element={<Offers mielec={false} />}
            />
            <Route path="/:category/" element={<Offers />} />
            <Route path="/:category/:id" element={<Offer />} />
            <Route path="/:category/:id/edytuj" element={<EditOffer />} />
          </Routes>
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
