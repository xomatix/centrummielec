import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseApiUrl } from "../Variables";
import Compressor from "compressorjs";
import DescEditor from "./DescEditor";
import { FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBoolIsSellOfferType(offerType) {
  switch (offerType.toLowerCase()) {
    case "sprzedaz":
      return false;
    case "wynajem":
      return true;
    default:
      break;
  }
}

async function uploadPhoto(photo, id) {
  const fullUrlPhoto = `${baseApiUrl}/posts/photo/${id}`;
  let formDataPhoto = new FormData();
  formDataPhoto.append(`photo0`, photo);

  try {
    const response = await fetch(fullUrlPhoto, {
      method: "POST",
      headers: {
        //'Content-Type': 'multipart/form-data',
        token: localStorage.getItem("token"),
      },
      body: formDataPhoto,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function deletePhoto(photo, id) {
  const fullUrlPhoto = `${baseApiUrl}/posts/photo/${id}`;
  let formDataPhoto = { photo: photo };

  try {
    const response = await fetch(fullUrlPhoto, {
      method: "DELETE",
      headers: {
        //'Content-Type': 'multipart/form-data',
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(formDataPhoto),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchDataFromApi(id) {
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

    json.parameters = json.parameters !== "" ? JSON.parse(json.parameters) : "";

    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//from there photos edits
async function addWatermark(file, watermarkText) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      const image = new Image();
      image.src = event.target.result;

      image.onload = async function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        ctx.font = image.size <= 500000 ? "14px Arial" : "32px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText(watermarkText, image.width / 2 - 150, image.height / 2);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
    };

    reader.readAsDataURL(file);
  });
}

async function addWatermarkToImage(photo, watermarkText) {
  const file = photo;

  const watermarkedBlob = await addWatermark(file, watermarkText);
  // Do something with the watermarkedBlob, such as displaying it or downloading it
  // const watermarkedDataURL = URL.createObjectURL(watermarkedBlob);
  // document.appendChild(watermarkedDataURL);
  // const downloadLink = document.createElement('a');
  // downloadLink.href = watermarkedDataURL;
  // downloadLink.download = 'watermarked_image.jpg';
  // downloadLink.click();
  return await new File([watermarkedBlob], photo.name);
}

//to there

function EditOffer() {
  let { id, category } = useParams();

  const [data, setData] = useState({
    title: "",
    description: "",
    price: 0,
    price_unit: "zł",
    size: 0,
    size_unit: "m²",
    parameters: {},
    photos: "",
    location: "",
    location_text: "",
    category: "Mieszkania",
    status: "Aktualne",
    offer_type: "Sprzedaz",
    is_recommended: "Nie",
    video: "",
    date_of_creation: getFormattedDate(),
  });
  const [parametersList, setParametersList] = useState({});
  const [isUploaded, setIsUploaded] = useState(true);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const dataFromApi = async () => {
      const reqData = await fetchDataFromApi(id);
      setData({
        ...data,
        title: reqData.title,
        description: reqData.description,
        price: reqData.price,
        price_unit: reqData.price_unit,
        size: reqData.size,
        size_unit: reqData.size_unit,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        is_recommended: reqData.is_recommended ? "Tak" : "Nie",
        status:
          reqData.status === 0
            ? "Aktualne"
            : reqData.status === 1
            ? "Rezerwacja"
            : reqData.status === 2
            ? "Sprzedane"
            : "Zrealizowane",
        offer_type: reqData.offer_type ? "Wynajem" : "Sprzedaz",
        location: reqData.location,
        location_text: reqData.location_text,
        date_of_creation: reqData.date_of_creation,
        video: reqData.video,
        photos:
          reqData.photos[0] === ","
            ? reqData.photos.substring(1)
            : reqData.photos,
      });
      setParametersList(reqData.parameters);

      //setPhotos()
    };
    if (id !== undefined && category !== undefined) {
      dataFromApi();
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const addParameterField = (key, e) => {
    if (key === undefined || key === "" || key === null) return;
    setParametersList({
      ...parametersList,
      [key]: "",
    });
  };

  const removeParameterField = (key, e) => {
    let updatedObject = { ...parametersList };
    delete updatedObject[key];
    setParametersList({ ...updatedObject });
  };

  const handleParameterInputChange = (key, e) => {
    const updatedFields = { ...parametersList };
    updatedFields[key] = e.target.value;
    setParametersList(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryNum = 0;
    switch (data.category.toLowerCase()) {
      case "mieszkania":
        categoryNum = 0;
        break;
      case "domy":
        categoryNum = 1;
        break;
      case "dzialki":
        categoryNum = 2;
        break;
      case "lokale":
        categoryNum = 3;
        break;

      default:
        break;
    }

    let is_recommended = 0;
    switch (data.is_recommended.toLowerCase()) {
      case "nie":
        is_recommended = 0;
        break;
      case "tak":
        is_recommended = 1;
        break;

      default:
        break;
    }

    let status = 0;
    switch (data.status.toLowerCase()) {
      case "aktualne":
        status = 0;
        break;
      case "rezerwacja":
        status = 1;
        break;
      case "sprzedane":
        status = 2;
        break;
      case "zrealizowane":
        status = 3;
        break;

      default:
        break;
    }

    let offer_type = 0;
    switch (data.offer_type.toLowerCase()) {
      case "sprzedaz":
        offer_type = 0;
        break;
      case "wynajem":
        offer_type = 1;
        break;

      default:
        break;
    }

    const formData = {
      ...data,
      category: categoryNum,
      is_recommended: is_recommended,
      status: status,
      offer_type: offer_type,
      parameters: parametersList,
      photos: id !== undefined ? data.photos : "",
    };
    //console.log(formData);

    const fullUrl =
      id === undefined || category === undefined
        ? `${baseApiUrl}/posts`
        : `${baseApiUrl}/posts/${id}`;
    const token = `Bearer ${localStorage.getItem("token")}`;

    try {
      await fetch(fullUrl, {
        method: id === undefined || category === undefined ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          //console.log(data);
          id = data;
          setIsUploaded(true);
        });
    } catch (error) {
      console.error("Error:", error);
      setIsUploaded(false);
    }

    if (id !== undefined && category !== undefined) {
      window.location = `/${category}/${id}`;
      return;
    }
    //handle image upload

    const fullUrlPhoto = `${baseApiUrl}/posts/photo/${id}`;
    let formDataPhoto = new FormData();
    photos.forEach((photo, index) => {
      formDataPhoto.append(`photo${index}`, photo);
    });
    console.log(photos);
    try {
      const response = await fetch(fullUrlPhoto, {
        method: "POST",
        headers: {
          //'Content-Type': 'multipart/form-data',
          token: token,
        },
        body: formDataPhoto,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setIsUploaded(true);
      window.location = `/${data.category.toLowerCase()}/${id}`;
    } catch (error) {
      console.error("Error:", error);
      setIsUploaded(false);
      window.location = `/${data.category.toLowerCase()}/${id}`;
    }
  };

  const parametersComponent = Object.keys(parametersList).map((key) => (
    <div key={key} className="flex items-center mb-3">
      <div className="w-1/4">
        <p className="font-medium">{key}</p>
      </div>
      <div className="w-3/4 flex">
        <input
          className="form-input w-full border rounded-lg p-2 mr-2"
          value={parametersList[key]}
          onChange={(e) => handleParameterInputChange(key, e)}
        />

        <button
          type="button"
          className="bg-red-500 text-white rounded-lg px-4 py-3"
          onClick={(e) => removeParameterField(key, e)}
        >
          <CgClose />
        </button>
      </div>
    </div>
  ));

  const [photos, setPhotos] = useState([]);
  const [isPhotoTooBig, setIsPhotoTooBig] = useState(false);

  const handlePhotoUpload = async (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    if (e.target.files[0].size > 500000) {
      setIsPhotoTooBig(true);
      return;
    }
    const newPhotos = [...photos];
    const photoWithWatermark = await addWatermarkToImage(
      e.target.files[0],
      "Centrum Nieruchomości Mielec"
    );
    //const photoWithWatermark = e.target.files[0]
    newPhotos.push(photoWithWatermark);
    setPhotos(newPhotos);
    setIsPhotoTooBig(false);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleDoubleclick = (index) => {
    if (index === 0) {
      return;
    }
    const newAtZeroPhoto = photos[index];
    let updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    updatedPhotos.unshift(newAtZeroPhoto);
    let photosStringList =
      data.photos.split(",")[0] === ""
        ? data.photos.split(",").splice(1)
        : data.photos.split(",");
    const temp = photosStringList[index];
    photosStringList[index] = photosStringList[0];
    photosStringList[0] = temp;
    setData({ ...data, photos: photosStringList.join(",") });
    setPhotos(updatedPhotos);
  };

  // eslint-disable-next-line no-unused-vars
  const photosComponent = (
    <div className="">
      <div class="input-group mb-3">
        <input
          type="file"
          class="form-control"
          id="inputGroupFile"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        {!isPhotoTooBig && (
          <label class="input-group-text" for="inputGroupFile">
            Ok
          </label>
        )}
        {isPhotoTooBig && (
          <label
            class="input-group-text bg-danger text-light"
            for="inputGroupFile"
          >
            Rozmiar zbyt duży
          </label>
        )}
      </div>
      <div className="d-flex overflow-auto">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`d-flex flex-column my-2 mx-2`}
            width={300}
          >
            <img
              className={"rounded d-inline "}
              style={{ objectFit: "cover" }}
              src={URL.createObjectURL(photo)}
              alt={`${index}`}
              width={300}
              height={300}
            />
            <button
              type="button"
              className="btn btn-success mt-2 "
              onClick={() => handleDoubleclick(index)}
            >
              Ustaw jako pierwsze 👈
            </button>
            <button
              type="button"
              className="btn btn-danger mt-2 "
              onClick={() => handleDeletePhoto(index)}
            >
              Usuń 🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const handleEditPhotoUpload = async (e) => {
    let currPhoto = e.target.files[0];
    if (e.target.files.length === 0) {
      return;
    }
    if (currPhoto.size > 500000) {
      const case_is_to_big = window.confirm(
        "Zdjęcie zbyt duże czy skompresować?"
      );
      if (case_is_to_big === true) {
        await new Compressor(e.target.files[0], {
          quality: 0.75, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            currPhoto = new File([compressedResult], compressedResult.name);
          },
        });
      } else {
        setIsPhotoTooBig(true);
        return;
      }
    }
    if (id !== undefined) {
      const resp = async () => {
        const photoWithWatermark = await addWatermarkToImage(
          currPhoto,
          "Centrum Nieruchomości Mielec"
        );
        // const photoWithWatermark = e.target.files[0]
        uploadPhoto(photoWithWatermark, id).then((response) => {
          try {
            let oldLinks = data.photos === "" ? data.photos : data.photos + ",";
            let updatedPhotos =
              oldLinks +
              response.photo.split(",")[response.photo.split(",").length - 1];
            setData({
              ...data,
              photos: updatedPhotos,
            });
            //console.log(data.photos);
          } catch (error) {
            setIsPhotoTooBig(true);
            console.error("photo not added");
          }
        });
      };
      resp();
    }
  };

  const handleEditDeletePhoto = (index) => {
    let updatedPhotos = data.photos.split(",");
    const urlPhotoToDelete = updatedPhotos.splice(index, 1);
    setData({ ...data, photos: updatedPhotos.join(",") });
    deletePhoto(urlPhotoToDelete, id);

    // console.log(updatedPhotos.join(','));
  };

  const handleEditDoubleclick = (index) => {
    const newFirstPhotoUrl = data.photos.split(",")[index];
    let updatedPhotosLinks = data.photos.split(",");
    updatedPhotosLinks.splice(index, 1);
    updatedPhotosLinks.unshift(newFirstPhotoUrl);
    setData({ ...data, photos: updatedPhotosLinks.join(",") });
  };

  const handleEditSwap = (index, direction) => {
    const photosLength = data.photos.split(",").length - 1;
    if (index + direction > photosLength || index + direction < 0) return;
    const mainPhoto = data.photos.split(",")[index];
    let updatedPhotosLinks = data.photos.split(",");
    updatedPhotosLinks[index] = updatedPhotosLinks[index + direction];
    updatedPhotosLinks[index + direction] = mainPhoto;
    setData({ ...data, photos: updatedPhotosLinks.join(",") });
  };

  const handleDescChange = (text) => {
    setData({ ...data, description: text });
  };

  const photosEditComponent = (
    <div className="mb-4 overflow-scroll">
      {/* File Input */}
      <div className="input-group mb-3">
        <label
          className="block mb-2 text-sm font-medium text-gray-700"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 bg-white focus:border-blue-500 focus:outline-none"
          id="file_input"
          type="file"
          accept="image/*"
          onChange={handleEditPhotoUpload}
        />

        {!isPhotoTooBig ? (
          <label className="input-group-text" htmlFor="inputGroupFile">
            Ok
          </label>
        ) : (
          <label
            className="input-group-text bg-red-500 text-white"
            htmlFor="inputGroupFile"
          >
            Rozmiar zbyt duży
          </label>
        )}
      </div>

      {/* Photos Display */}
      <div className="flex overflow-auto space-x-4">
        {data.photos !== "" &&
          data.photos.split(",").map((photoUrl, index) => (
            <div key={index} className="flex flex-col items-center my-2">
              <img
                className="rounded object-cover min-w-[300px] h-full"
                src={baseApiUrl + "/" + photoUrl}
                alt={`${index}`}
                width={400}
                height={400}
              />

              <div className="flex justify-between mt-2 w-full">
                <button
                  type="button"
                  className="bg-yellow-500 text-white rounded-lg px-4"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditSwap(index, -1);
                  }}
                >
                  <FaArrowLeft />
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white rounded-lg px-4 py-2"
                  onClick={() => handleEditDoubleclick(index)}
                >
                  Pierwsze
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-lg px-4 py-2"
                  onClick={() => handleEditDeletePhoto(index)}
                >
                  Usuń 🗑
                </button>
                <button
                  type="button"
                  className="bg-yellow-500 text-white rounded-lg px-4 py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditSwap(index, 1);
                  }}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Edycja Oferty</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Photos Section */}
        <div className="flex justify-center mb-4">
          {id === undefined && photosComponent}
          {id !== undefined && photosEditComponent}
        </div>

        {/* Date of Creation */}
        <div className="mb-4">
          <input
            required
            className="border rounded-lg p-2 w-full"
            type="date"
            id="date_of_creation"
            name="date_of_creation"
            value={data.date_of_creation}
            onChange={handleInputChange}
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Tytuł:
          </label>
          <input
            required
            className="border rounded-lg p-2 w-full"
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleInputChange}
          />
        </div>

        {/* Price Section */}
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Cena:{" "}
              {!getBoolIsSellOfferType(data.offer_type) &&
                `${Math.round(data.price / data.size)} ${data.price_unit}/${
                  data.size_unit
                }`}
            </label>
            <input
              className="border rounded-lg p-2 w-full"
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-initial">
            <label
              htmlFor="price_unit"
              className="block text-sm font-medium mb-1"
            >
              Waluta:
            </label>
            <select
              className="border rounded-lg p-2"
              id="price_unit"
              name="price_unit"
              value={data.price_unit}
              onChange={handleInputChange}
            >
              <option>zł</option>
              <option>€</option>
              <option>$</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Opis:
          </label>
          {isLoaded && (
            <DescEditor
              defaultValue={data.description}
              onTextChange={handleDescChange}
            />
          )}
        </div>

        {/* Size Section */}
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label htmlFor="size" className="block text-sm font-medium mb-1">
              Powierzchnia:
            </label>
            <input
              className="border rounded-lg p-2 w-full"
              type="number"
              id="size"
              name="size"
              value={data.size}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-initial">
            <label
              htmlFor="size_unit"
              className="block text-sm font-medium mb-1"
            >
              Jednostka:
            </label>
            <select
              className="border rounded-lg p-2"
              id="size_unit"
              name="size_unit"
              value={data.size_unit}
              onChange={handleInputChange}
            >
              <option>m²</option>
              <option>ar</option>
              <option>ha</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Kategoria:
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            id="category"
            name="category"
            value={data.category}
            onChange={handleInputChange}
          >
            <option>Mieszkania</option>
            <option>Domy</option>
            <option>Dzialki</option>
            <option>Lokale</option>
          </select>
        </div>

        {/* Recommended */}
        <div className="mb-4">
          <label
            htmlFor="is_recommended"
            className="block text-sm font-medium mb-1"
          >
            Polecaj:
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            id="is_recommended"
            name="is_recommended"
            value={data.is_recommended}
            onChange={handleInputChange}
          >
            <option>Nie</option>
            <option>Tak</option>
          </select>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status:
          </label>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Zrealizowane będzie wciąż pokazywane na standardowej liście a
            sprzedane będzie przeniesione do listy na dole strony głównej.
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            id="status"
            name="status"
            value={data.status}
            onChange={handleInputChange}
          >
            <option>Aktualne</option>
            <option>Rezerwacja</option>
            <option>Sprzedane</option>
            <option>Zrealizowane</option>
          </select>
        </div>

        {/* Offer Type */}
        <div className="mb-4">
          <label
            htmlFor="offer_type"
            className="block text-sm font-medium mb-1"
          >
            Typ oferty:
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            id="offer_type"
            name="offer_type"
            value={data.offer_type}
            onChange={handleInputChange}
          >
            <option>Sprzedaz</option>
            <option>Wynajem</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Mapa iframe:
          </label>
          <input
            className="border rounded-lg p-2 w-full"
            type="text"
            id="location"
            name="location"
            value={data.location}
            onChange={handleInputChange}
          />
        </div>

        {/* Location Text */}
        <div className="mb-4">
          <label
            htmlFor="location_text"
            className="block text-sm font-medium mb-1"
          >
            Lokalizacja tekst:
          </label>
          <input
            className="border rounded-lg p-2 w-full"
            type="text"
            id="location_text"
            name="location_text"
            value={data.location_text}
            onChange={handleInputChange}
          />
        </div>

        {/* Video URL */}
        <div className="mb-4">
          <label htmlFor="video" className="block text-sm font-medium mb-1">
            Iframe video:
          </label>
          <input
            className="border rounded-lg p-2 w-full"
            type="text"
            id="video"
            name="video"
            value={data.video}
            onChange={handleInputChange}
          />
        </div>

        {/* Parameters */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Parametry:</label>
          {parametersComponent}

          <div className="flex space-x-2 mb-4">
            <input
              className="border rounded-lg p-2 flex-1"
              id="newParameterKey"
              placeholder="New Parameter Key"
            />
            <button
              className="bg-green-600 text-white rounded-lg px-4"
              onClick={(e) => {
                addParameterField(
                  document.getElementById("newParameterKey").value,
                  e
                );
                document.getElementById("newParameterKey").value = "";
              }}
              type="button"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <button
            className="bg-green-600 text-white rounded-lg p-2 w-full"
            type="submit"
          >
            {id === undefined ? (
              <div>Dodaj oferte</div>
            ) : (
              <div>Edytuj oferte</div>
            )}
          </button>
        </div>

        {/* Error Message */}
        {!isUploaded && (
          <div className="text-red-500">
            <div className="alert alert-danger" role="alert">
              Nie dodano oferty / Błąd przy dodawaniu
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default EditOffer;
