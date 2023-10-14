import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { baseApiUrl } from '../Variables'
import Compressor from 'compressorjs';

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getBoolIsSellOfferType(offerType) {
  switch (offerType.toLowerCase()) {
    case 'sprzedaz':
      return false;
    case 'wynajem':
      return true;
    default:
      break;
  }
}

async function uploadPhoto(photo, id) {
  const fullUrlPhoto = `${baseApiUrl}/posts/photo/${id}`;
  let formDataPhoto = new FormData();
  formDataPhoto.append(`photo0`, photo)

  try {
    const response = await fetch(fullUrlPhoto, {
      method: 'POST',
      headers: {
        //'Content-Type': 'multipart/form-data',
        'token': localStorage.getItem('token'),
      },
      body: formDataPhoto,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function deletePhoto(photo, id) {
  const fullUrlPhoto = `${baseApiUrl}/posts/photo/${id}`;
  let formDataPhoto = { photo: photo };

  try {
    const response = await fetch(fullUrlPhoto, {
      method: 'DELETE',
      headers: {
        //'Content-Type': 'multipart/form-data',
        'token': localStorage.getItem('token'),
      },
      body: JSON.stringify(formDataPhoto),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

  } catch (error) {
    console.error('Error:', error);

  }
}

async function fetchDataFromApi(id) {
  try {
    const apiUrl = `${baseApiUrl}/posts/${id}`;
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok');
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
      json.firstPhoto = json.photos.substring(1, json.photos.length).split(',')[0];
    else
      json.firstPhoto = json.photos.split(',')[0];

    json.parameters = json.parameters !== "" ? JSON.parse(json.parameters) : "";

    return json;
  } catch (error) {
    console.error('Error fetching data:', error);
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
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        ctx.font = image.size <= 500000 ? '14px Arial' : '32px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(watermarkText, (image.width / 2) - 150, (image.height / 2));

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
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
    title: '',
    description: '',
    price: 0,
    price_unit: "zł",
    size: 0,
    size_unit: 'm²',
    parameters: {},
    photos: '',
    location: '',
    location_text: '',
    category: 'Mieszkania',
    status: 'Aktualne',
    offer_type: 'Sprzedaz',
    is_recommended: 'Nie',
    video: '',
    date_of_creation: getFormattedDate()
  });
  const [parametersList, setParametersList] = useState({});
  const [isUploaded, setIsUploaded] = useState(true);

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
        status: reqData.status === 0 ? "Aktualne" : reqData.status === 1 ? "Rezerwacja" : "Sprzedane",
        offer_type: reqData.offer_type ? "Wynajem" : "Sprzedaz",
        location: reqData.location,
        location_text: reqData.location_text,
        date_of_creation: reqData.date_of_creation,
        video: reqData.video,
        photos: reqData.photos[0] === "," ? reqData.photos.substring(1) : reqData.photos,
      })
      setParametersList(reqData.parameters)

      //setPhotos()
    }
    if (id !== undefined && category !== undefined) {
      dataFromApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
      [key]: '',
    });
  }

  const removeParameterField = (key, e) => {
    let updatedObject = { ...parametersList };
    delete updatedObject[key]
    setParametersList({ ...updatedObject });
  };

  const handleParameterInputChange = (key, e) => {
    const updatedFields = { ...parametersList };
    updatedFields[key] = e.target.value;
    setParametersList(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryNum = 99;
    switch (data.category.toLowerCase()) {
      case 'mieszkania':
        categoryNum = 0;
        break;
      case 'domy':
        categoryNum = 1;
        break;
      case 'dzialki':
        categoryNum = 2;
        break;
      case 'lokale':
        categoryNum = 3;
        break;

      default:
        break;
    }

    let is_recommended = 0;
    switch (data.is_recommended.toLowerCase()) {
      case 'nie':
        is_recommended = 0;
        break;
      case 'tak':
        is_recommended = 1;
        break;

      default:
        break;
    }

    let status = 0;
    switch (data.status.toLowerCase()) {
      case 'aktualne':
        status = 0;
        break;
      case 'rezerwacja':
        status = 1;
        break;
      case 'sprzedane':
        status = 2;
        break;
      case 'zrealizowane':
        status = 3;
        break;

      default:
        break;
    }

    let offer_type = 0;
    switch (data.offer_type.toLowerCase()) {
      case 'sprzedaz':
        offer_type = 0;
        break;
      case 'wynajem':
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
      photos: id !== undefined ? data.photos : '',
    };
    //console.log(formData);

    const fullUrl = (id === undefined || category === undefined) ? `${baseApiUrl}/posts` : `${baseApiUrl}/posts/${id}`;
    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      await fetch(fullUrl, {
        method: id === undefined || category === undefined ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify(formData),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        //console.log(data);
        id = data;
        setIsUploaded(true);
      })

    } catch (error) {
      console.error('Error:', error);
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
      formDataPhoto.append(`photo${index}`, photo)
    })
    console.log(photos)
    try {
      const response = await fetch(fullUrlPhoto, {
        method: 'POST',
        headers: {
          //'Content-Type': 'multipart/form-data',
          'token': token,
        },
        body: formDataPhoto,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setIsUploaded(true);
      window.location = `/${data.category.toLowerCase()}/${id}`;
    } catch (error) {
      console.error('Error:', error);
      setIsUploaded(false);
      window.location = `/${data.category.toLowerCase()}/${id}`;
    }
  }

  const bootstrapStyle = {
    formDiv: 'mb-3 ',
    formDivRow: 'mb-3 row',
    label: 'form-label',
    formDivCol: 'col-md-6',
    formDivColLarge: 'col-md-9',
    formDivColSmall: 'col-md-3',
    input: 'form-control',
  }

  const parametersComponent = Object.keys(parametersList).map((key) => (
    <div key={key} className={bootstrapStyle.formDivRow}>
      <div className={bootstrapStyle.formDivColSmall}>
        <p
          className={bootstrapStyle.input}
        >{key}</p>
      </div>
      <div className={bootstrapStyle.formDivCol}>
        <input
          className={bootstrapStyle.input}
          value={parametersList[key]}
          onChange={(e) => handleParameterInputChange(key, e)}
        ></input>
      </div>
      <div className={bootstrapStyle.formDivColSmall}>
        <button type='button' className={" btn btn-danger w-100"} onClick={(e) => removeParameterField(key, e)} >✖</button>
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
    const photoWithWatermark = await addWatermarkToImage(e.target.files[0], "Centrum Nieruchomości Mielec")
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
    if (index === 0) { return }
    const newAtZeroPhoto = photos[index];
    let updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1)
    updatedPhotos.unshift(newAtZeroPhoto);
    let photosStringList = data.photos.split(',')[0] === '' ? data.photos.split(',').splice(1) : data.photos.split(',');
    const temp = photosStringList[index];
    photosStringList[index] = photosStringList[0];
    photosStringList[0] = temp;
    setData({ ...data, photos: photosStringList.join(',') })
    setPhotos(updatedPhotos);
  };

  // eslint-disable-next-line no-unused-vars
  const photosComponent = (
    <div className={bootstrapStyle.formDiv}>
      <div class="input-group mb-3">
        <input type="file" class="form-control" id="inputGroupFile" accept='image/*' onChange={handlePhotoUpload} />
        {!isPhotoTooBig && <label class="input-group-text" for="inputGroupFile">Ok</label>}
        {isPhotoTooBig && <label class="input-group-text bg-danger text-light" for="inputGroupFile">Rozmiar zbyt duży</label>}
      </div>
      <div className="d-flex overflow-auto">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`d-flex flex-column my-2 mx-2`}
            width={300}
          >
            <img className={"rounded d-inline "} style={{ 'objectFit': 'cover' }} src={URL.createObjectURL(photo)} alt={`${index}`} width={300} height={300} />
            <button
              type='button'
              className="btn btn-success mt-2 "
              onClick={() => handleDoubleclick(index)}
            >Ustaw jako pierwsze 👈</button>
            <button
              type='button'
              className="btn btn-danger mt-2 "
              onClick={() => handleDeletePhoto(index)}
            >Usuń 🗑</button>
          </div>
        ))}
      </div>
    </div>);

  const handleEditPhotoUpload = async (e) => {
    let currPhoto = e.target.files[0]
    if (e.target.files.length === 0) {
      return;
    }
    if (currPhoto.size > 500000) {
      const case_is_to_big = window.confirm("Zdjęcie zbyt duże czy skompresować?")
      if (case_is_to_big === true) {

        await new Compressor(e.target.files[0], {
          quality: 0.75, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            currPhoto = new File([compressedResult], compressedResult.name)
          },
        });
      }
      else {
        setIsPhotoTooBig(true);
        return;
      }
    }
    if (id !== undefined) {
      const resp = async () => {
        const photoWithWatermark = await addWatermarkToImage(currPhoto, "Centrum Nieruchomości Mielec")
        // const photoWithWatermark = e.target.files[0]
        uploadPhoto(photoWithWatermark, id)
          .then((response) => {
            try {
              let oldLinks = data.photos === "" ? data.photos : data.photos + ',';
              let updatedPhotos = oldLinks + response.photo.split(',')[response.photo.split(',').length - 1];
              setData({
                ...data,
                photos: updatedPhotos,
              })
              //console.log(data.photos);
            } catch (error) {
              setIsPhotoTooBig(true)
              console.error("photo not added")
            }
          })
      }
      resp()
    }
  }

  const handleEditDeletePhoto = (index) => {
    let updatedPhotos = data.photos.split(',')
    const urlPhotoToDelete = updatedPhotos.splice(index, 1)
    setData({ ...data, photos: updatedPhotos.join(',') })
    deletePhoto(urlPhotoToDelete, id);

    // console.log(updatedPhotos.join(','));
  }

  const handleEditDoubleclick = (index) => {
    const newFirstPhotoUrl = data.photos.split(',')[index]
    let updatedPhotosLinks = data.photos.split(',')
    updatedPhotosLinks.splice(index, 1)
    updatedPhotosLinks.unshift(newFirstPhotoUrl)
    setData({ ...data, photos: updatedPhotosLinks.join(',') })
  }

  const handleEditSwap = (index, direction) => {
    const photosLength = data.photos.split(',').length-1
    if(index + direction > photosLength || index + direction < 0)
      return;
    const mainPhoto = data.photos.split(',')[index]
    let updatedPhotosLinks = data.photos.split(',')
    updatedPhotosLinks[index] = updatedPhotosLinks[index+direction]
    updatedPhotosLinks[index+direction] = mainPhoto
    setData({ ...data, photos: updatedPhotosLinks.join(',') })
  }

  const photosEditComponent = (
    <div className={bootstrapStyle.formDiv}>
      <div class="input-group mb-3 ">
        <input type="file" className="form-control" id="inputGroupFile" accept='image/*' onChange={handleEditPhotoUpload} ></input>
        {!isPhotoTooBig && <label class="input-group-text" for="inputGroupFile">Ok</label>}
        {isPhotoTooBig && <label class="input-group-text bg-danger text-light" for="inputGroupFile">Rozmiar zbyt duży</label>}
      </div>
      <div className="d-flex overflow-auto">
        {data.photos !== "" && data.photos.split(',').map((photoUrl, index) => (
          <div
            key={index}
            className={`d-flex flex-column my-2 mx-2`}
            width={300}
          >
            <img className={"rounded d-inline "} style={{ 'objectFit': 'cover' }} src={baseApiUrl + '/' + photoUrl} alt={`${index}`} width={300} height={300} />
            <button
              type='button'
              className="btn btn-success mt-2 "
              onClick={() => handleEditDoubleclick(index)}
            >Ustaw jako pierwsze 👈</button>
            <div className='d-flex justify-content-between'>
              <button
                type='button'
                className="btn btn-warning mt-2 "
                onClick={(e) => {e.preventDefault();handleEditSwap(index, -1);}}
              >&#10094; W lewo</button>
              <button
                type='button'
                className="btn btn-warning mt-2 "
                onClick={(e) => {e.preventDefault();handleEditSwap(index, 1);}}
              >W prawo &#10095;</button>
            </div>
            <button
              type='button'
              className="btn btn-danger mt-2 "
              onClick={() => handleEditDeletePhoto(index)}
            >Usuń 🗑</button>
          </div>
        ))}
      </div>
    </div>);

  return (
    <div className='container mt-5'>
      <h1>Add or edit offer</h1>
      <form onSubmit={handleSubmit}>
        {/* photos zdjecia*/}
        {/* {id === undefined && photosComponent} */}
        {id !== undefined && photosEditComponent}
        {/* data */}
        <input
          required
          className={bootstrapStyle.input}
          placeholder="Tytuł"
          type="date"
          id="date_of_creation"
          name="date_of_creation"
          value={data.date_of_creation}
          onChange={handleInputChange}
        />
        {/* tytuł */}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="title" className={bootstrapStyle.label}>Tytuł:</label>
          <input
            required
            className={bootstrapStyle.input}
            placeholder="Tytuł"
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleInputChange}
          />
        </div>
        {/*  cena */}
        <div className={bootstrapStyle.formDivRow}>
          <div className={bootstrapStyle.formDivColLarge}>
            <label htmlFor="price" className={bootstrapStyle.label}>Cena: {!getBoolIsSellOfferType(data.offer_type) && Math.round(data.price / data.size)} {!getBoolIsSellOfferType(data.offer_type) && `${data.price_unit}/${data.size_unit}`}</label>
            <input
              className={bootstrapStyle.input}
              placeholder="Cena"
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={handleInputChange}
            />
          </div>
          <div className={bootstrapStyle.formDivColSmall}>
            <label htmlFor="price_unit" className={bootstrapStyle.label}>Waluta:</label>
            <select
              className={bootstrapStyle.input}
              placeholder="Waluta"
              type="text"
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
        {/* Opis */}
        <div className={bootstrapStyle.formDiv } >
          <label htmlFor="description" className={bootstrapStyle.label}>Opis:</label>
          <textarea
            required
            className={bootstrapStyle.input}
            style={{height:400}}
            placeholder="Opis"
            type="text"
            id="description"
            name="description"
            value={data.description}
            onChange={handleInputChange}
          />
        </div>
        {/*  Powierzchnia  */}
        <div className={bootstrapStyle.formDivRow}>
          <div className={bootstrapStyle.formDivColLarge}>
            <label htmlFor="size" className={bootstrapStyle.label}>Powierzchnia:</label>
            <input
              className={bootstrapStyle.input}
              placeholder="powierzchnia"
              type="number"
              id="size"
              name="size"
              value={data.size}
              onChange={handleInputChange}
            />
          </div>
          <div className={bootstrapStyle.formDivColSmall}>
            <label htmlFor="size_unit" className={bootstrapStyle.label}>Jednostka:</label>
            <select
              className={bootstrapStyle.input}
              placeholder="waluta"
              type="text"
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

        {/*kategoria*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="category" className={bootstrapStyle.label}>Kategoria:</label>
          <select
            className={bootstrapStyle.input}
            placeholder="Kategoria"
            type="text"
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

        {/*polecaj*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="is_recommended" className={bootstrapStyle.label}>Polecaj:</label>
          <select
            className={bootstrapStyle.input}
            placeholder=""
            type="text"
            id="is_recommended"
            name="is_recommended"
            value={data.is_recommended}
            onChange={handleInputChange}
          >
            <option>Nie</option>
            <option>Tak</option>
          </select>
        </div>

        {/*status*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="status" className={bootstrapStyle.label}>Status:</label>
          <select
            className={bootstrapStyle.input}
            placeholder=""
            type="text"
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

        {/*typ oferty czy wynajem czy sprzedaż*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="offer_type" className={bootstrapStyle.label}>Typ oferty:</label>
          <select
            className={bootstrapStyle.input}
            placeholder=""
            type="text"
            id="offer_type"
            name="offer_type"
            value={data.offer_type}
            onChange={handleInputChange}
          >
            <option>Sprzedaz</option>
            <option>Wynajem</option>
          </select>
        </div>

        {/* lokalizacja*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="location" className={bootstrapStyle.label}>Mapa iframe:</label>
          <input
            className={bootstrapStyle.input}
            placeholder="iframe"
            type="text"
            id="location"
            name="location"
            value={data.location}
            onChange={handleInputChange}
          />
        </div>

        {/* lokalizacja tekst*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="location_text" className={bootstrapStyle.label}>Lokalizacja tekst:</label>
          <input
            className={bootstrapStyle.input}
            placeholder="Lokalizacja"
            type="text"
            id="location_text"
            name="location_text"
            value={data.location_text}
            onChange={handleInputChange}
          />
        </div>

        {/* url video*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="video" className={bootstrapStyle.label}>Iframe video:</label>
          <input
            className={bootstrapStyle.input}
            placeholder="iframe video"
            type="text"
            id="video"
            name="video"
            value={data.video}
            onChange={handleInputChange}
          />
        </div>

        {/* parametry*/}
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="" className={bootstrapStyle.label}>Parametry:</label>

          {parametersComponent}

          <div className={bootstrapStyle.formDivRow}>
            <div className={bootstrapStyle.formDivColLarge}>

              <input
                className={bootstrapStyle.input + " mb-2"}
                id='newParameterKey'
              ></input>
            </div>
            <div className={bootstrapStyle.formDivColSmall}>
              <button className={"btn btn-success w-100 "} onClick={(e) => {
                addParameterField(document.getElementById('newParameterKey').value, e);
                document.getElementById('newParameterKey').value = ''
              }
              }
                type='button'>➕</button>
            </div>
          </div>
        </div>

        <div className={bootstrapStyle.form}>
          <button className={"btn btn-success w-100 mb-4"} type="submit">{id === undefined ? 'Dodaj oferte 💾' : 'Edytuj oferte ✏'}</button>
        </div>
        {!isUploaded && <p><div class="alert alert-danger" role="alert">
          Nie dodano oferty / Błąd przy dodawaniu
        </div></p>}
      </form>
    </div>
  )
}

export default EditOffer