// src/Offers.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { baseApiUrl } from "../Variables";

function Offers({ rent, mielec }) {
  let { category } = useParams();

  let categoryId = -1;
  switch (category) {
    case "mieszkania":
      categoryId = 0;
      break;
    case "domy":
      categoryId = 1;
      break;
    case "dzialki":
      categoryId = 2;
      break;
    case "lokale":
      categoryId = 3;
      break;
    default:
      break;
  }

  const [data, setData] = useState([]);
  const [dataRest, setDataRest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(page) {
      let rentQuery =
        rent !== undefined && rent
          ? "&offer_type=1"
          : categoryId === -1
          ? ""
          : "&offer_type=0";
      if (categoryId === 1 || categoryId === 2) rentQuery = "";
      let categoryQuery = categoryId !== -1 ? `category=${categoryId}&` : "";
      let statusQuery = category === "zrealizowane" ? "&status=2" : "";
      try {
        const apiUrl = `${baseApiUrl}/posts?${categoryQuery}page=${page}${rentQuery}${statusQuery}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let json = await response.json();

        if (mielec === true) {
          json = json.filter(
            (element) =>
              element.location_text !== null &&
              element.location_text.toLowerCase().includes("mielec")
          );
        } else if (mielec === false) {
          json = json.filter(
            (element) =>
              element.location_text === null ||
              !element.location_text.toLowerCase().includes("mielec")
          );
        }

        json.forEach((element) => {
          if (element.photos === "" || element.photos === null) return;
          element.thumbnail = element.photos.split(",")[0];
        });
        json.forEach((element) => {
          element.parameters = JSON.parse(
            element.parameters == null ? "[]" : element.parameters
          );
          let decimal =
            element.price.toString().split(".")[1] === undefined
              ? ""
              : "." + element.price.toString().split(".")[1];
          let normal_part = element.price.toString().split(".")[0];
          element.price_text =
            normal_part
              .split("")
              .reverse()
              .join("")
              .replace(/(.{3})/g, "$1 ")
              .split("")
              .reverse()
              .join("") + decimal;
        });
        json.sort(
          (a, b) => new Date(b.date_of_creation) - new Date(a.date_of_creation)
        );

        if (page === 0) setData(json);
        else setDataRest(json);
        setLoading(false);
        if (json.length > 0) return true;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
      return false;
    }

    for (let index = 0; index < 2; index++) {
      if (!fetchData(index)) break;
    }
  }, [categoryId, rent, mielec, category]);

  return (
    <div className="py-4" style={{ background: "#F2F3F4" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mx-auto" style={{ minHeight: "75vh" }}>
          <h2 className="text-center text-2xl font-semibold mb-4">
            {category.charAt(0).toUpperCase()}
            {category.slice(1)} na{" "}
            {category === "zrealizowane"
              ? "oferty"
              : rent !== undefined && rent === true
              ? "wynajem"
              : "sprzedaż"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 justify-items-center mx-auto px-4 max-w-4xl">
            {[...data, ...dataRest].map((item, index) => (
              <Link
                key={index + 999}
                to={`/${category}/${item.id}-${item.title
                  .replace("/", "")
                  .split(" ")
                  .join("-")}`}
                className="flex flex-col md:flex-row bg-white rounded-lg hover:bg-gray-50 transition ease-in-out duration-300 w-full
                 shadow shadow-gray-300 hover:shadow-xl "
              >
                <img
                  className="object-cover w-full h-48 md:h-56 md:w-64 rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                  src={`${baseApiUrl}/${item.thumbnail}`}
                  alt={item.title}
                />
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    {item.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700">
                    {item.location_text}
                    <br />
                    Powierzchnia: {item.size} {item.size_unit}
                    <br />
                    Cena:{" "}
                    <b>
                      {item.price_text} {item.price_unit}
                    </b>
                    <br />
                    Cena za {item.size_unit}:{" "}
                    {Math.floor(item.price / item.size)} {item.price_unit}/
                    {item.size_unit}
                    <br />
                    {categoryId === 0 && "Piętro" in item.parameters && (
                      <>
                        Piętro: {item.parameters["Piętro"]}
                        <br />
                      </>
                    )}
                    {categoryId === 2 && "Media" in item.parameters && (
                      <>
                        Media: {item.parameters["Media"]}
                        <br />
                      </>
                    )}
                    {(categoryId === 0 || (categoryId === 3 && rent)) &&
                      rent &&
                      "Opłaty" in item.parameters && (
                        <>
                          Opłaty: {item.parameters["Opłaty"]}
                          <br />
                        </>
                      )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;
