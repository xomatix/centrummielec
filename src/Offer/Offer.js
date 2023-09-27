import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { baseApiUrl } from '../Variables';
import SlideShow from './SlideShow'

async function deletePost(e, id, category) {
    e.preventDefault();
    if (window.confirm('Czy na pewno chcesz usunąć ten post?')) {
        try {
            const apiUrl = `${baseApiUrl}/posts/${id}`;
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    token: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            window.location = '/' + category;
        } catch (error) {
            console.error('Error deleting offer:', error);
        }
    }
}

function Offer() {
    let { category, id } = useParams();
    id = id.split('-')[0]

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videoOpen, setVideoOpen] = useState(false);

    useEffect(() => {
        // Function to fetch data from the API
        async function fetchData() {
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
                let decimal = json.price.toString().split('.')[1] === undefined ? '' : '.' + json.price.toString().split('.')[1]
                let normal_part = json.price.toString().split('.')[0]
                json.price_text = normal_part.split("").reverse().join('').replace(/(.{3})/g, '$1 ').split('').reverse().join('') + decimal

                setData(json);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }

        // Call the fetchData function
        fetchData();
    }, [id]);


    function resizeMap(mapString) {
        const htmlElementString = mapString;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlElementString, 'text/html');
        const element = doc.body.firstChild;

        if (element === undefined || element === null)
            return '<div></div>';
        else {
            element.style.width = '100%';
            element.style.height = '400px';

            return element.outerHTML;
        }
    }

    function resizeVideo(videoString) {
        const htmlElementString = videoString.replace('autoplay;', '').replace('accelerometer;', '');
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlElementString, 'text/html');
        const element = doc.body.firstChild;

        if (element === undefined || element === null)
            return '<div></div>';
        else {
            element.width = '100%';
            element.height = '100%';

            return element.outerHTML;
        }
    }

    const togleVideo = () => {
        setVideoOpen(videoOpen ? false : true);
    }

    /**
     * zdjęcie 1
     * zdjęcia reszta małę
     * kolumna lewa tytuł i lokalizacja
     * kolumna prawa cena i cena za rozmiar
     * 
     */
    return (
        <div className='container mt-4'>
            {loading ? <h1>Loading...</h1> :
                <div className='row'>
                    <div className={`rounded text-center m-3 col p-2 bg-danger text-light ${data.status === 1 ? '' : 'd-none'}`} width='100%' >REZERWACJA</div>
                    <div className={`rounded text-center m-3 col p-2 bg-danger text-light ${data.status === 3 ? '' : 'd-none'}`} width='100%' >SRZEDANE W OSTATNIM CZASIE</div>
                    <div className='col-md-12'>
                        <SlideShow photosUrls={data.photos.split(',')} />
                    </div>
                    {/**video button */}
                    {(data.video !== undefined && data.video !== '') &&
                        <div className='my-4 d-flex flex-column justify-content-center'>
                            <button type='button' className='btn btn-success mx-auto mb-4' onClick={() => togleVideo()}>
                                <div dangerouslySetInnerHTML={{__html: `${videoOpen ? 'Zamknij film &#10005;' : 'Otwórz film z nieruchomości'}` }}></div>
                            </button>
                            {videoOpen &&
                                <div className='' style={{ height: '50vh' }} dangerouslySetInnerHTML={{ __html: `${resizeVideo(data.video)}` }} ></div>
                            }
                        </div>}

                    <div className='mt-2'>
                        <div className='row'>
                            <div className='col-md-9'>
                                <h3 >{data.title}</h3>
                                <a href='#map' className='text-success'>{data.location_text}</a>
                            </div>
                            <div className='col-md-3 '>
                                <h3 className=''><b>{data.price_text}</b> {data.price_unit}</h3>
                                {data.offer_type === 0 && <p className=''><b>{Math.floor(data.price / data.size)}</b> {data.price_unit}/{data.size_unit}</p>}
                            </div>
                        </div>
                        <div className="container mt-4 mb-5">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Szczegóły ogłoszenia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Powierzchnia</td>
                                        <td>{data.size} {data.size_unit}</td>
                                    </tr>
                                    {Object.entries(data.parameters).map(([key, value], index) => (
                                        <tr key={index}>
                                            <td>{key}</td>
                                            <td>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h4>Opis:</h4>
                        {data.description.split('\n').map(line =>
                            <div dangerouslySetInnerHTML={{ __html: `${line.startsWith("*") ? '<b>' : ''}${line.replace('*', '')}${line.startsWith("*") ? '</b>' : ''}<br/>` }}></div>
                        )}
                        {/* <p>{data.description.split('\n')[0]}</p> */}
                        {/* <p className='mb-4' style={{whiteSpace:'pre-line'}}>{data.description}</p> */}
                        <div id='map' className='my-4' dangerouslySetInnerHTML={{ __html: resizeMap(data.location) }}></div>

                        {/** dla zalogowanych */}
                        <div className="text-center">
                            {localStorage.getItem('token') !== null &&
                                <Link to={`/${category}/${id}/edytuj`} className='m-2'>
                                    <button className="btn btn-info text-center" type='button'>Edytuj oferte ✏</button>
                                </Link>}
                            {localStorage.getItem('token') !== null &&
                                <button className="btn btn-danger text-center" type='button' onClick={(e) => deletePost(e, id, category)}>Usuń oferte 🗑</button>}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Offer