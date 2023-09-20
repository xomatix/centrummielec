import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { baseApiUrl } from '../Variables';

async function deletePost(e, id, category) {
    e.preventDefault();
    if(window.confirm('Czy na pewno chcesz usunąć ten post?')){
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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div>
            <div>Offer from category: {category} and with id : {id}</div>
            {loading ? <h1>Loading...</h1> :
                <>
                    <div>
                        <img loading="lazy" src={baseApiUrl + '/' + data.firstPhoto} alt={data.title} width="300px" height="300px"></img>
                        <h3>Title: {data.title}</h3>
                        <p>Price: {data.price} {data.price_unit}</p>
                        <p>Size: </p>
                    </div>
                    <div>
                        <p>Description: {data.description}</p>
                        <p>Location: {data.location_text}</p>
                        <p>Map: {data.location}</p>
                        <div className="container mt-4">
                            <table className="table">
                                <tbody>
                                    <th>
                                        <td>Szczegóły ogłoszenia</td>
                                    </th>
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
                        <div class="text-center">
                            {localStorage.getItem('token') !== null &&
                            <Link to={`/${category}/${id}/edytuj`} className='m-2'>
                            <button className="btn btn-info text-center" type='button'>Edytuj oferte ✏</button>
                            </Link>}
                            {localStorage.getItem('token') !== null &&
                            <button className="btn btn-danger text-center" type='button' onClick={(e) => deletePost(e, id, category)}>Usuń oferte 🗑</button>}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Offer