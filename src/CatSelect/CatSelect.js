import React, { useState } from "react";

function CatSelect() {
  const [selectedCategory, setSelectedCategory] = useState("Mieszkania");

  const handleButtonPressed = (e) => {
    e.preventDefault();

    console.log(selectedCategory.toLowerCase());
    switch (selectedCategory.toLowerCase()) {
      case "mieszkania":
        window.location = "/mieszkania";
        break;
      case "mieszkania na wynajem":
        window.location = "/mieszkania/wynajem";
        break;
      case "działki w mielcu":
        window.location = "/dzialki/mielec";
        break;
      case "działki poza mielcem":
        window.location = "/dzialki/poza-mielcem";
        break;
      case "domy":
        window.location = "/domy";
        break;
      case "lokale na sprzedaż":
        window.location = "/lokale";
        break;
      case "lokale na wynajem":
        window.location = "/lokale/wynajem";
        break;

      default:
        break;
    }
  };

  const handleValueChange = (e) => {
    e.preventDefault();
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="main relative" style={{ minHeight: "50vh" }}>
        <img
          src="https://centrummielec.pl/api/static/back_front.jpg"
          className="absolute top-0 left-0 w-full h-full object-cover"
          alt="background"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-black/50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h2 className="text-white text-2xl mb-8">Działamy od 1999r.</h2>

          <div className="w-full md:max-w-md bg-white rounded-lg p-5 shadow-md flex flex-col space-y-4 mx-4 max-w-[85vw]">
            <form className="w-full">
              <label htmlFor="category-select" className="sr-only">
                Wybierz kategorię
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleValueChange}
                className="block py-2.5 px-0 w-full text-md font-medium text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
              >
                <option value="Mieszkania">Mieszkania</option>
                <option value="Mieszkania na wynajem">
                  Mieszkania na wynajem
                </option>
                <option value="Domy">Domy</option>
                <option value="Działki w Mielcu">Działki w Mielcu</option>
                <option value="Działki poza Mielcem">
                  Działki poza Mielcem
                </option>
                <option value="Lokale na sprzedaż">Lokale na sprzedaż</option>
                <option value="Lokale na wynajem">Lokale na wynajem</option>
              </select>
            </form>

            <button
              className="bg-green-600 text-white font-semibold py-2 px-6 w-full rounded-lg hover:bg-green-700 transition-all"
              onClick={handleButtonPressed}
            >
              Szukaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatSelect;
