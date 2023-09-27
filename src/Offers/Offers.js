// src/Offers.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baseApiUrl } from '../Variables';

function Offers({ rent, mielec }) {
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
            let rentQuery = rent !== undefined && rent ? '&offer_type=1' : '&offer_type=0'
            if (categoryId === 1 || categoryId === 2)
                rentQuery = ''
            let categoryQuery = categoryId !== -1 ? `category=${categoryId}&` : ''
            let statusQuery = category === 'zrealizowane' ? '&status=2' : ''
            try {
                const apiUrl = `${baseApiUrl}/posts?${categoryQuery}page=${page}${rentQuery}${statusQuery}`;
                const response = await fetch(apiUrl)

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                let json = await response.json();

                if (mielec === true) {
                    json = json.filter(element => element.location_text !== null && element.location_text.toLowerCase().includes('mielec'))
                } else if (mielec === false) {
                    json = json.filter(element => element.location_text === null || !element.location_text.toLowerCase().includes('mielec'))
                }

                json.forEach(element => {
                    if (element.photos === '' || element.photos === null)
                        return;
                    if (element.photos[0] === ',')
                        element.thumbnail = element.photos.split(',')[1];
                    else
                        element.thumbnail = element.photos.split(',')[0];
                });
                json.forEach(element => {
                    element.parameters = JSON.parse(element.parameters == null ? '[]' : element.parameters)
                    let decimal = element.price.toString().split('.')[1] === undefined ? '' : '.'+element.price.toString().split('.')[1]
                    let normal_part = element.price.toString().split('.')[0]
                    element.price_text = normal_part.split("").reverse().join('').replace(/(.{3})/g, '$1 ').split('').reverse().join('') + decimal
                    // console.log(normal_part.split("").reverse().join('').replace(/(.{3})/g, '$1 ').split('').reverse().join('') + decimal)
                })
                //sortowanie po dacie
                json.sort((a,b) => new Date(b.date_of_creation) - new Date(a.date_of_creation))

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

    }, [categoryId, rent, mielec, category]);

    return (
        <div className='py-4' style={{ 'background': '#F2F3F4' }}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="container" style={{ minHeight: "75vh" }}>
                    <h2 className="ms-4 mb-4">{category.charAt(0).toUpperCase()}{category.slice(1)} na {category === 'zrealizowane' ? 'oferty' : (rent !== undefined && rent === true) ? 'wynajem' : 'sprzedaż'}</h2>
                    <ul>
                        {data.map((item, index) => (
                            <div key={index + 999}>
                                <Link key={item.id} to={`/${category}/${item.id}-${item.title.split(' ').join('-')}`} className={`rounded text-decoration-none mb-4 d-none d-lg-block border `} >
                                    <div className={`list-item text-dark d-flex overflow-hidden text-decoration-none bg-light`}>
                                        <img src={`${baseApiUrl}/${item.thumbnail}`}
                                            loading='' width={300}
                                            height={250}
                                            className={""} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '30/25' }} alt="Item" />
                                        <div className="list-item-data p-3 d-flex flex-column my-auto" style={{width:'100%'}}>
                                            <h4>{item.title}</h4>
                                            <p>
                                                {item.location_text}<br />
                                                Powierzchnia: {item.size}{item.size_unit}<br />
                                                Cena: <b>{item.price_text} {item.price_unit}</b><br />
                                                {/* <div dangerouslySetInnerHTML={{ __html: `` }}></div> */}
                                                Cena za {item.size_unit}: {Math.floor(item.price / item.size)} {item.price_unit}/{item.size_unit}<br />
                                                {(categoryId === 0 && 'Piętro' in item.parameters) && <>Piętro: {item.parameters['Piętro']}<br /></>}
                                                {(categoryId === 2 && 'Media' in item.parameters) && <>Media: {item.parameters['Media']}<br /></>}
                                                {((categoryId === 0 || (categoryId === 3 && rent)) && rent && 'Opłaty' in item.parameters) && <>Opłaty: {item.parameters['Opłaty']}<br /></>}
                                            </p>
                                            {(item.status !== 3 && categoryId !== 0 && !(categoryId === 3 && rent)) && <p>{item.description.slice(0, 100)}{item.description.length > 100 && '...'}</p>}
                                            {item.status === 3 && <div className="p-2 mx-auto rounded bg-danger text-light text-center" style={{minWidth:'100%'}}><b>Sprzedane w ostatnim czasie</b></div>}
                                        </div>
                                    </div>
                                </Link>
                                <Link key={item.id + 10000} to={`/${category}/${item.id}-${item.title.split(' ').join('-')}`} className={`text-decoration-none d-lg-none`}>
                                    <div className={`row col-12 rounded list-item text-dark d-flex mb-4 overflow-hidden  border bg-light`}>
                                        <img src={`${baseApiUrl}/${item.thumbnail}`}
                                            loading='' width='100%'
                                            height={410}
                                            className={"coloumn d-none d-sm-block p-0"} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '30/25' }} alt="Item" />
                                        <img src={`${baseApiUrl}/${item.thumbnail}`}
                                            loading='' width='100%'
                                            height={200}
                                            className={"coloumn d-xs-block d-sm-none p-0"} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '30/25' }} alt="Item" />
                                        <div className="column list-item-data p-3 my-auto">
                                            <h5>{item.title.slice(0, 50)}{item.title.length > 50 ? '...' : ''}</h5>
                                            <p>
                                                {item.location_text}<br />
                                                Cena: <b>{item.price_text} {item.price_unit}</b><br />
                                                Cena za {item.size_unit}: {Math.floor(item.price / item.size)} {item.price_unit}/{item.size_unit}<br />
                                                Powierzchnia: {item.size}{item.size_unit}<br />
                                                {(categoryId === 0 && 'Piętro' in item.parameters) && <>Piętro: {item.parameters['Piętro']}<br /></>}
                                                {(categoryId === 2 && 'Media' in item.parameters) && <>Media: {item.parameters['Media']}<br /></>}
                                                {((categoryId === 0 || (categoryId === 3 && rent)) && rent && 'Opłaty' in item.parameters) && <>Opłaty: {item.parameters['Opłaty']}<br /></>}
                                            </p>
                                            {item.status !== 3 && categoryId !== 0 && !(categoryId === 3 && rent) && <p className='d-none d-md-block'>{item.description.slice(0, 100)}{item.description.length > 100 && '...'}</p>}
                                            {item.status === 3 && <div className="p-2 mx-auto rounded bg-danger text-light text-center" style={{minWidth:'100%'}}><b>Sprzedane w ostatnim czasie</b></div>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {dataRest.map((item, index) => (
                            <div key={index + 1999}>
                                <Link key={item.id} to={`/${category}/${item.id}-${item.title.split(' ').join('-')}`} className={`rounded text-decoration-none mb-4 d-none d-lg-block border `} >
                                    <div className={`list-item text-dark d-flex overflow-hidden text-decoration-none bg-light`}>
                                        <img src={`${baseApiUrl}/${item.thumbnail}`}
                                            loading='' width={300}
                                            height={250}
                                            className={""} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '30/25' }} alt="Item" />
                                        <div className="list-item-data p-3 d-flex flex-column my-auto" style={{width:'100%'}}>
                                            <h4>{item.title}</h4>
                                            <p>
                                                {item.location_text}<br />
                                                Powierzchnia: {item.size}{item.size_unit}<br />
                                                Cena: <b>{item.price_text} {item.price_unit}</b><br />
                                                {/* <div dangerouslySetInnerHTML={{ __html: `` }}></div> */}
                                                Cena za {item.size_unit}: {Math.floor(item.price / item.size)} {item.price_unit}/{item.size_unit}<br />
                                                {(categoryId === 0 && 'Piętro' in item.parameters) && <>Piętro: {item.parameters['Piętro']}<br /></>}
                                                {(categoryId === 2 && 'Media' in item.parameters) && <>Media: {item.parameters['Media']}<br /></>}
                                                {((categoryId === 0 || (categoryId === 3 && rent)) && rent && 'Opłaty' in item.parameters) && <>Opłaty: {item.parameters['Opłaty']}<br /></>}
                                            </p>
                                            {(item.status !== 3 && categoryId !== 0 && !(categoryId === 3 && rent)) && <p>{item.description.slice(0, 100)}{item.description.length > 100 && '...'}</p>}
                                            {item.status === 3 && <div className="p-2 mx-auto rounded bg-danger text-light text-center" style={{minWidth:'100%'}}><b>Sprzedane w ostatnim czasie</b></div>}
                                        </div>
                                    </div>
                                </Link>
                                <Link key={item.id + 10000} to={`/${category}/${item.id}-${item.title.split(' ').join('-')}`} className={`text-decoration-none d-lg-none`}>
                                    <div className={`row col-12 rounded list-item text-dark d-flex mb-4 overflow-hidden  border bg-light`}>
                                        <img src={`${baseApiUrl}/${item.thumbnail}`}
                                            loading='' width='100%'
                                            height={410}
                                            className={"coloumn d-none d-sm-block p-0"} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '30/25' }} alt="Item" />
                                        <img src={`${baseApiUrl}/${item.thumbnail}`}
                                            loading='' width='100%'
                                            height={200}
                                            className={"coloumn d-xs-block d-sm-none p-0"} style={{ 'objectFit': 'cover', 'objectPosition': 'center', 'aspectRatio': '30/25' }} alt="Item" />
                                        <div className="column list-item-data p-3 my-auto">
                                            <h5>{item.title.slice(0, 50)}{item.title.length > 50 ? '...' : ''}</h5>
                                            <p>
                                                {item.location_text}<br />
                                                Cena: <b>{item.price_text} {item.price_unit}</b><br />
                                                Cena za {item.size_unit}: {Math.floor(item.price / item.size)} {item.price_unit}/{item.size_unit}<br />
                                                Powierzchnia: {item.size}{item.size_unit}<br />
                                                {(categoryId === 0 && 'Piętro' in item.parameters) && <>Piętro: {item.parameters['Piętro']}<br /></>}
                                                {(categoryId === 2 && 'Media' in item.parameters) && <>Media: {item.parameters['Media']}<br /></>}
                                                {((categoryId === 0 || (categoryId === 3 && rent)) && rent && 'Opłaty' in item.parameters) && <>Opłaty: {item.parameters['Opłaty']}<br /></>}
                                            </p>
                                            {item.status !== 3 && categoryId !== 0 && !(categoryId === 3 && rent) && <p className='d-none d-md-block'>{item.description.slice(0, 100)}{item.description.length > 100 && '...'}</p>}
                                            {item.status === 3 && <div className="p-2 mx-auto rounded bg-danger text-light text-center" style={{minWidth:'100%'}}><b>Sprzedane w ostatnim czasie</b></div>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Offers;