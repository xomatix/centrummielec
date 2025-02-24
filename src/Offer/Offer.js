import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { baseApiUrl } from "../Variables";
import SlideShow from "./SlideShow";
import BriefContact from "../Contact/BriefContact";
import PrintButton from "../PrintOffer/PrintButton";

async function deletePost(e, id, category) {
  e.preventDefault();
  if (window.confirm("Czy na pewno chcesz usunąć ten post?")) {
    try {
      const apiUrl = `${baseApiUrl}/posts/${id}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location = "/" + category;
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  }
}

function Offer() {
  let { category, id } = useParams();
  id = id.split("-")[0];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    // Function to fetch data from the API
    async function fetchData() {
      try {
        const apiUrl = `${baseApiUrl}/posts/${id}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let json = await response.json();

        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            if (json[key] === null) {
              json[key] = "";
            }
          }
        }
        if (json.photos[0] === ",")
          json.firstPhoto = json.photos
            .substring(1, json.photos.length)
            .split(",")[0];
        else json.firstPhoto = json.photos.split(",")[0];

        json.parameters =
          json.parameters !== "" ? JSON.parse(json.parameters) : "";
        let decimal =
          json.price.toString().split(".")[1] === undefined
            ? ""
            : "." + json.price.toString().split(".")[1];
        let normal_part = json.price.toString().split(".")[0];
        json.price_text =
          normal_part
            .split("")
            .reverse()
            .join("")
            .replace(/(.{3})/g, "$1 ")
            .split("")
            .reverse()
            .join("") + decimal;

        setData(json);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    // Call the fetchData function
    fetchData();
  }, [id]);

  function resizeMap(mapString) {
    try {
      const htmlElementString = mapString;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlElementString, "text/html");
      const element = doc.body.firstChild;

      if (element === undefined || element === null) return "<div></div>";
      else {
        element.style.width = "100%";
        element.style.height = "400px";

        return element.outerHTML;
      }
    } catch (error) {
      console.error("can't load map");
    }
  }

  function resizeVideo(videoString) {
    const htmlElementString = videoString
      .replace("autoplay;", "")
      .replace("accelerometer;", "");
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlElementString, "text/html");
    const element = doc.body.firstChild;

    if (element === undefined || element === null) return "<div></div>";
    else {
      element.width = "100%";
      element.height = "100%";

      return element.outerHTML;
    }
  }

  const togleVideo = () => {
    setVideoOpen(videoOpen ? false : true);
  };

  /**
   * zdjęcie 1
   * zdjęcia reszta małę
   * kolumna lewa tytuł i lokalizacja
   * kolumna prawa cena i cena za rozmiar
   *
   */
  return (
    <div className="w-full bg-gray-100 p-4 h-full">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full max-w-7xl mx-auto">
          <div className="col-span-4 w-full my-auto mx-auto">
            {/* Status ogłoszenia */}
            <div className="rounded shadow-md mb-4">
              <div
                className={`rounded text-center p-2 bg-red-600 text-normal text-white ${
                  data.status === 1 ? "" : "hidden"
                }`}
                width="100%"
              >
                REZERWACJA
              </div>
              <div
                className={`rounded text-center p-2 bg-green-600 text-normal text-white ${
                  data.status === 3 && data.offer_type === 0 ? "" : "hidden"
                }`}
                width="100%"
              >
                SRZEDANE W OSTATNIM CZASIE
              </div>
              <div
                className={`rounded text-center p-2 bg-green-600 text-normal text-white ${
                  data.status === 3 && data.offer_type === 1 ? "" : "hidden"
                }`}
                width="100%"
              >
                WYNAJĘTE W OSTATNIM CZASIE
              </div>
              <div
                className={`rounded text-center p-2 bg-green-600 text-normal text-white ${
                  data.status === 2 && data.offer_type === 0 ? "" : "hidden"
                }`}
                width="100%"
              >
                SRZEDANE
              </div>
              <div
                className={`rounded text-center p-2 bg-green-600 text-normal text-white ${
                  data.status === 2 && data.offer_type === 1 ? "" : "hidden"
                }`}
                width="100%"
              >
                WYNAJĘTE
              </div>
            </div>

            {/* Tytul */}
            <div className="relative">
              <div className=" bg-white rounded shadow shadow-md print:hidden">
                {/* print:hidden */}
                <SlideShow photosUrlsBase={data.photos.split(",")} />
                <div className="p-3">
                  <div className="text-2xl font-bold ">{data.title}</div>
                  <div className="flex flex-row justify-between">
                    <a
                      href="#map"
                      className="text-green-600 text-lg font-semibold "
                    >
                      {data.location_text}
                    </a>
                  </div>
                </div>
              </div>
              <div className="absolute right-2 bottom-2 print:left-0 print:top-0">
                <PrintButton offer={data} />
              </div>
            </div>

            {/**video button */}
            {data.video !== undefined && data.video !== "" && (
              <div className="my-4 d-flex flex-column justify-content-center">
                <button
                  type="button"
                  className="btn btn-success mx-auto mb-4"
                  onClick={() => togleVideo()}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${
                        videoOpen
                          ? "Zamknij film &#10005;"
                          : "Otwórz film z nieruchomości"
                      }`,
                    }}
                  ></div>
                </button>
                {videoOpen && (
                  <div
                    className=""
                    style={{ height: "50vh" }}
                    dangerouslySetInnerHTML={{
                      __html: `${resizeVideo(data.video)}`,
                    }}
                  ></div>
                )}
              </div>
            )}

            {/* Prawa czesc */}
            <div className="grid grid-items-1 gap-2 mt-2 print:hidden">
              {/* Cena */}
              <div className="p-3 bg-white rounded shadow shadow-md">
                <div className="mb-2 font-bold text-lg">Koszt</div>
                <div className="text-2xl font-bold">
                  {data.price_text} {data.price_unit}
                </div>
                {data.offer_type === 0 && (
                  <div className="text-green-600 font-bold text-lg">
                    {Math.floor(data.price / data.size)} {data.price_unit}/
                    {data.size_unit}
                  </div>
                )}
              </div>

              <div className="p-3 bg-white rounded shadow shadow-md ">
                <div className="mb-2 font-semibold text-lg">
                  Szczegóły ogłoszenia
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  <div className=" p-1">
                    <div className="font-normal text-gray-500 text-sm">
                      Powierzchnia
                    </div>
                    <div className="font-semibold text-lg">
                      {data.size} {data.size_unit}
                    </div>
                  </div>

                  {Object.entries(data.parameters).map(
                    ([key, value], index) => (
                      <div key={index} className="p-1">
                        <div className="font-normal text-gray-500 text-sm text-pretty">
                          {key}
                        </div>
                        <div className="font-semibold text-lg text-pretty">
                          {value}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="p-3 bg-white rounded shadow shadow-md ">
                <div className="text-2xl font-bold">Opis:</div>
                <div
                  className="parent-div"
                  id="description-rendered"
                  dangerouslySetInnerHTML={{ __html: `${data.description}` }}
                ></div>
              </div>

              {data.location != null && data.location.length > 0 && (
                <div
                  id="map"
                  className="p-3 bg-white rounded shadow shadow-md"
                  dangerouslySetInnerHTML={{ __html: resizeMap(data.location) }}
                ></div>
              )}

              {/* For logged-in users */}
              <div className="text-center mt-4">
                {localStorage.getItem("token") !== null && (
                  <Link to={`/${category}/${id}/edytuj`} className="m-2">
                    <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                      Edytuj oferte
                    </button>
                  </Link>
                )}
                {localStorage.getItem("token") !== null && (
                  <button
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-200"
                    type="button"
                    onClick={(e) => deletePost(e, id, category)}
                  >
                    Usuń oferte
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2 print:hidden">
            <BriefContact />
          </div>
        </div>
      )}
    </div>
  );
}

export default Offer;
