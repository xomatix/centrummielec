import React, { useEffect, useState } from "react";
import { baseApiUrl } from "../Variables";
import { Link } from "react-router-dom";

function Recom() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getRecommendedData() {
      await fetch(`${baseApiUrl}/posts?is_recommended=1`)
        .then((response) => {
          if (!response.ok) {
            console.error("Error getting data" + response.message);
          }
          return response.json();
        })
        .then((data) => {
          data.forEach((element) => {
            element.firstPhoto =
              baseApiUrl +
              "/" +
              (element.photos[0] === ","
                ? element.photos.split(",")[1]
                : element.photos.split(",")[0]);

            let category = "";
            switch (element.category) {
              case 0:
                category = "mieszkania";
                break;
              case 1:
                category = "domy";
                break;
              case 2:
                category = "dzialki";
                break;
              case 3:
                category = "lokale";
                break;
              default:
                break;
            }
            element.category = category;
          });
          const shuffled = data.sort(() => 0.5 - Math.random());
          setData(shuffled.slice(0, 6));
        });
    }
    getRecommendedData();
  }, []);

  return (
    <div className="py-6 bg-gray-100 w-full">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Polecane <span className="text-green-600">oferty</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center mx-auto px-4 max-w-7xl">
        {data.map((item, index) => (
          <Link
            key={index}
            to={`/${item.category}/${item.id}-${item.title
              .split(" ")
              .join("-")}`}
            className="relative group"
          >
            <div className="w-full h-[300px] overflow-hidden rounded-lg shadow-md">
              <img
                src={item.firstPhoto}
                alt={`Zdjęcie polecanej oferty ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 h-[30%] top-[70%] bg-gradient-to-t from-black/40 via-black/40 to-transparent rounded-lg"></div>

            <div className="absolute bottom-0 left-0 p-4 text-white">
              <div className="font-bold text-lg">
                {item.title.length > 35 ? item.title.substring(0, 32) + "..." : item.title}
              </div>
              <div className="text-sm">{item.location_text}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recom;
