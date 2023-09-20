import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { baseApiUrl } from '../Variables'

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
    category: 'Mieszknia',
    status: 'Aktualne',
    offer_type: 'Sprzedaz',
    is_recommended: 'Nie',
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
    if(key === undefined || key === "" || key === null) return;
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

    let categoryNum = -1;
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
        status = 1;
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

    if (id !== undefined || category !== undefined) {
      window.location = `/${category}/${id}`;
      return;
    }
    //handle image upload

    const fullUrlPhoto = `${baseApiUrl}/posts/photo/${id}`;
    let formDataPhoto = new FormData();
    photos.forEach((photo, index) => {
      formDataPhoto.append(`photo${index}`, photo)
    })
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

  const handlePhotoUpload = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    const newPhotos = [...photos];
    if (e.target.files[0].size > 500000) {
      setIsPhotoTooBig(true);
      return;
    }
    newPhotos.push(e.target.files[0]);
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

  const handleEditPhotoUpload = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    if (e.target.files[0].size > 500000) {
      setIsPhotoTooBig(true);
      return;
    }
    if (id !== undefined) {
      const resp = async () => {
        const resp = await uploadPhoto(e.target.files[0], id)
        .then((response) => {
          try{
            let oldLinks = data.photos === "" ? data.photos : data.photos + ',';
            let updatedPhotos = oldLinks + response.photo.split(',')[response.photo.split(',').length-1];
            setData({
              ...data,
              photos: updatedPhotos,
            })
            //console.log(data.photos);
          } catch (error){
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
    setData({...data, photos: updatedPhotos.join(',')})
    deletePhoto(urlPhotoToDelete, id);
    
    // console.log(updatedPhotos.join(','));
  }

  const handleEditDoubleclick = (index) => {
    const newFirstPhotoUrl = data.photos.split(',')[index]
    let updatedPhotosLinks = data.photos.split(',')
    updatedPhotosLinks.splice(index,1)
    updatedPhotosLinks.unshift(newFirstPhotoUrl)
    setData({...data, photos: updatedPhotosLinks.join(',')})
  }

  const photosEditComponent = (
    <div className={bootstrapStyle.formDiv}>
      <div class="input-group mb-3">
        <input type="file" class="form-control" id="inputGroupFile" accept='image/*' onChange={handleEditPhotoUpload} />
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
        {id === undefined && photosComponent}
        {id !== undefined && photosEditComponent}

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
        <div className={bootstrapStyle.formDiv}>
          <label htmlFor="description" className={bootstrapStyle.label}>Opis:</label>
          <textarea
            required
            className={bootstrapStyle.input}
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
          <label htmlFor="location" className={bootstrapStyle.label}>Współrzędne:</label>
          <input
            className={bootstrapStyle.input}
            placeholder="xx.xxxxxx, xx,xxxxxxxx"
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