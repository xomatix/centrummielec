// src/Offers.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baseApiUrl } from '../Variables';

function Offers() {
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
        // Function to fetch data from the API
        async function fetchData(page) {
            try {
                const apiUrl = `${baseApiUrl}/posts?category=${categoryId}&page=${page}`;
                const response = await fetch(apiUrl)

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                let json = await response.json();
                //console.log(json);
                json.forEach(element => {
                    if (element.photos === '' || element.photos === null)
                        return;
                    if (element.photos[0] === ',')
                        element.thumbnail = element.photos.split(',')[1];
                    else
                        element.thumbnail = element.photos.split(',')[0];
                });
                if (page === 0)
                    setData(json);
                else
                    setDataRest(json);
                setLoading(false);
                if (json.length > 0) {
                    //console.log(json.length)
                    return true;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
            return false;
        }

        for (let index = 0; index < 2; index++) {
            if (!fetchData(index))
                break;
        }

    }, [categoryId]);

    return (
        <div className='mb-4' style={{ 'background': '#F2F3F4' }}>
            <h1>Offers Page with category {category}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="container">
                    <ul>
                        {data.map((item) => (
                            <Link key={item.id} to={`/${category}/` + item.id} className="text-decoration-none d-sm-none d-md-block">
                                <div className="list-item text-dark d-flex mb-4 border-secondary overflow-hidden bg-white ">
                                    <img src={`${baseApiUrl}/${item.thumbnail}`}
                                        loading='lazy' width={250}
                                        height={200}
                                        className={""} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '25/20' }} alt="Item" />
                                    <div className="list-item-data p-3 ">
                                        <h5>{item.title}</h5>
                                        <p>
                                            <b>{item.price} {item.price_unit}</b>   {Math.floor(item.price/item.size)} {item.price_unit}/{item.size_unit}    {item.size}{item.size_unit}<br />
                                            {item.description.slice(0, 200)}{item.description.length > 200 && '...'}<br />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {dataRest.map((item) => (
                            <Link key={item.id} to={'/mieszkania/' + item.id}>
                                <li >{item.title}<br></br>{item.description}</li>
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Offers;