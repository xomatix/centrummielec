// src/Offers.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { baseApiUrl } from "../Variables";
import BriefContact from "../Contact/BriefContact";

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
      if (mielec === true) categoryId = 2;
      else categoryId = 4;
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
    <div className="" style={{ background: "#F2F3F4" }}>
      {loading ? (
        <div className="flex justify-center  items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="w-100">
          <div className="flex justify-center w-100 bg-white pt-1 pb-3 mb-4">
            <h2 className="w-[90%] lg:w-[10000px] max-w-6xl text-2xl font-semibold border-b-[1px] uppercase border-green-600 pb-2 text-center">
              {category.charAt(0).toUpperCase()}
              {category.slice(1)} {category !== "zrealizowane" ? "na " : ""}
              {category === "zrealizowane"
                ? "oferty"
                : rent !== undefined && rent === true
                ? "wynajem"
                : "sprzedaż"}
            </h2>
          </div>
          <div className="max-w-7xl mx-auto" style={{ minHeight: "75vh" }}>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-6 gap-6 justify-items-center mx-auto px-4 max-w-7xl">
              <div className="col-span-1 lg:col-span-4 grid grid-cols-1 gap-4">
                {[...data, ...dataRest].map((item, index) => (
                  <div>
                    <Link
                      key={index + 999}
                      to={
                        category === "zrealizowane"
                          ? `/zrealizowane`
                          : `/${category}/${item.id}-${item.title
                              .replace("/", "")
                              .split(" ")
                              .join("-")}`
                      }
                      className="grid grid-cols-1 sm:grid-cols-7 bg-white rounded-lg hover:bg-gray-50 transition ease-in-out duration-300 w-full
                 shadow shadow-gray-300 hover:shadow-xl "
                    >
                      <div className="object-cover text-sm col-span-2 h-64 w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none relative">
                        {/* Image */}
                        <img
                          loading="lazy"
                          className="object-cover col-span-2 h-64 w-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                          src={`${baseApiUrl}/${item.thumbnail}`}
                          alt={item.title}
                        />

                        {/* REZERWACJA */}
                        <div
                          className={`absolute top-2 left-2 w-fit-content rounded text-center p-1 bg-red-600 text-white ${
                            item.status === 1 ? "" : "hidden"
                          }`}
                        >
                          REZERWACJA
                        </div>

                        {/* SPRZEDANE W OSTATNIM CZASIE */}
                        <div
                          className={`absolute top-2 left-2  w-fit-content rounded text-center p-1 bg-red-600 text-white ${
                            (item.status === 3 || item.status === 2) &&
                            item.offer_type === 0
                              ? ""
                              : "hidden"
                          }`}
                        >
                          SPRZEDANE
                        </div>

                        {/* WYNAJĘTE W OSTATNIM CZASIE */}
                        <div
                          className={`absolute top-2 left-2  w-fit-content rounded text-center p-1 bg-green-600 text-white ${
                            (item.status === 3 || item.status === 2) &&
                            item.offer_type === 1
                              ? ""
                              : "hidden"
                          }`}
                        >
                          WYNAJĘTE
                        </div>
                      </div>
                      <div className="flex flex-col col-span-5 justify-start p-4 ">
                        <h5 className="text-xl md:text-2xl font-bold text-pretty tracking-tight text-gray-900 mb-5 h-16">
                          {item.title}
                        </h5>
                        <p className="font-normal text-gray-700">
                          <b>{item.location_text}</b>
                          <br />
                          Powierzchnia: {item.size} {item.size_unit}
                          <br />
                          {category !== "zrealizowane" && (
                            <div>
                              Cena:{" "}
                              <b>
                                {item.price_text} {item.price_unit}
                              </b>
                              <br />
                              {!rent && (
                                <div>
                                  Cena za {item.size_unit}:{" "}
                                  {Math.floor(item.price / item.size)}{" "}
                                  {item.price_unit}/{item.size_unit}
                                  <br />
                                </div>
                              )}
                            </div>
                          )}
                          {categoryId === 0 && "Piętro" in item.parameters && (
                            <>
                              Piętro: {item.parameters["Piętro"]}
                              <br />
                            </>
                          )}
                          {rent && "Kaucja" in item.parameters && (
                            <>
                              Kaucja: {item.parameters["Kaucja"]}
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
                  </div>
                ))}
              </div>
              <div className="col-span-1 w-full lg:col-span-2">
                <BriefContact />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;
