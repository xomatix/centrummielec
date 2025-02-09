import React from "react";
import Recom from "../Recom/Recom";
import CatSelect from "../CatSelect/CatSelect";
import { Link } from "react-router-dom";
import Advantages from "./Advantages";
import Contact from "../Contact/Contact";
import Hintbar from "./Hintbar";

function Home() {
  return (
    <div>
      <CatSelect />
      <Hintbar />
      <Recom />
      <Advantages />
      <div className="text-center mx-auto my-5">
        <Link to="/zrealizowane">
          <button className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">
            Sprawdź zrealizowane przez nas oferty
          </button>
        </Link>
      </div>
      {/* Contact */}
      <Contact />
    </div>
  );
}

export default Home;
