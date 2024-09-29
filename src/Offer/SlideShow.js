import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { baseApiUrl } from "../Variables";

const SlideShow = ({ photosUrlsBase }) => {
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [photosUrls, setPhotosUrls] = useState([]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && isFullscreen) {
      setIsFullscreen(false);
    } else if (e.key === "ArrowRight") {
      setMainPhotoIndex((prev) => (prev + 1) % photosUrls.length);
    } else if (e.key === "ArrowLeft") {
      setMainPhotoIndex(
        (prev) => (prev - 1 + photosUrls.length) % photosUrls.length
      );
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [photosUrls]);

  useEffect(() => {
    let arr = [];
    for (let index = 0; index < photosUrlsBase.length; index++) {
      arr.push(baseApiUrl + "/" + photosUrlsBase[index]);
    }
    setPhotosUrls(arr);
  }, [photosUrlsBase]);

  return (
    <div className="relative">
      {/* Fullscreen View */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-85 z-50 flex items-center justify-center">
          <img
            src={photosUrls[mainPhotoIndex]}
            className="max-h-full max-w-full object-contain"
            alt={`Image ${mainPhotoIndex + 1}`}
          />
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <FaTimes />
          </button>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-4 rounded-md"
            onClick={() =>
              setMainPhotoIndex(
                (mainPhotoIndex - 1 + photosUrls.length) % photosUrls.length
              )
            }
          >
            <FaArrowLeft />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-4 rounded-md"
            onClick={() =>
              setMainPhotoIndex((mainPhotoIndex + 1) % photosUrls.length)
            }
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* Main Image */}
      <div className="relative">
        <img
          src={photosUrls[mainPhotoIndex]}
          className="w-full h-[60vh] object-cover cursor-pointer rounded shadow shadow-lg"
          alt={`Image ${mainPhotoIndex + 1}`}
          onClick={toggleFullscreen}
        />
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-4 rounded opacity-70"
          onClick={() =>
            setMainPhotoIndex(
              (mainPhotoIndex - 1 + photosUrls.length) % photosUrls.length
            )
          }
        >
          <FaArrowLeft />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-4 rounded opacity-70"
          onClick={() =>
            setMainPhotoIndex((mainPhotoIndex + 1) % photosUrls.length)
          }
        >
          <FaArrowRight />
        </button>
        <div className="flex justify-center mt-2">
          <span className="text-gray-700">
            {mainPhotoIndex + 1} / {photosUrls.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-auto mt-2 ">
        {photosUrls.map((url, index) => (
          <div key={index} className="flex flex-col items-center mx-2 mb-2 ">
            <img
              src={url}
              className={`w-20 min-w-[20vw] md:min-w-20 h-20 object-cover cursor-pointer rounded shadow 
                  ${
                    mainPhotoIndex == index
                      ? "border border-gray-800 border-4"
                      : ""
                  }`}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setMainPhotoIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
