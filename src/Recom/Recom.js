import React, { useEffect, useState, useRef } from "react";
import { baseApiUrl } from "../Variables";
import { Link } from "react-router-dom";
import "./Recom.css"; // Import the custom CSS file

function Recom() {
  const [data, setData] = useState([]);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

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
          setData(shuffled.slice(0, 12)); // Increase the number of items fetched
        });
    }
    getRecommendedData();
  }, []);

  useEffect(() => {
    const startScrolling = () => {
      intervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }
      }, 5000); // Adjust the interval as needed
    };

    const stopScrolling = () => {
      clearInterval(intervalRef.current);
    };

    startScrolling();

    if (scrollRef.current) {
      scrollRef.current.addEventListener("mouseenter", stopScrolling);
      scrollRef.current.addEventListener("mouseleave", startScrolling);
    }

    return () => {
      clearInterval(intervalRef.current);
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("mouseenter", stopScrolling);
        scrollRef.current.removeEventListener("mouseleave", startScrolling);
      }
    };
  }, []);

  return (
    <div className="py-6 bg-gray-100 w-full">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Polecane <span className="text-green-600">oferty</span>
      </h2>

      <div
        className="flex overflow-x-auto space-x-7 px-4 max-w-7xl mx-auto custom-scrollbar pb-2" // Add custom-scrollbar class
        ref={scrollRef}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {data.map((item, index) => (
          <Link
            key={index}
            to={`/${item.category}/${item.id}-${item.title
              .split(" ")
              .join("-")}`}
            className="relative group flex-shrink-0 w-[400px] h-[320px]" // Increase the width to make them larger
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="w-full h-full overflow-hidden rounded-lg shadow-md"> {/* Increase the height to maintain 4:3 aspect ratio */}
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
