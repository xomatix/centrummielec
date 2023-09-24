import React, { useEffect, useState } from 'react'
import { baseApiUrl } from '../Variables'
import { Link } from 'react-router-dom'


function Recom() {
    const [data, setData] = useState([])

    useEffect(() => {
        async function getRecommendedData() {
            await fetch(`${baseApiUrl}/posts?is_recommended=1`)
                .then(response => {
                    if (!response.ok) {
                        console.error("Error getting data" + response.message)
                    }
                    return response.json()
                }).then(data => {
                    data.forEach(element => {
                        element.firstPhoto = baseApiUrl + '/' + (element.photos[0] === ',' ? element.photos.split(',')[1] : element.photos.split(',')[0])

                        let category = ''
                        switch (element.category) {
                            case 0:
                                category = 'mieszkania'
                                break
                            case 1:
                                category = 'domy'
                                break
                            case 2:
                                category = 'dzialki'
                                break
                            case 3:
                                category = 'lokale'
                                break
                            default:
                                break
                        }
                        element.category = category
                    });
                    const random = Math.floor(Math.random() * (data.length - 5))
                    setData(data.slice(random, random + 6))
                })
        }
        getRecommendedData()
    }, [])

    return (
        <div className=' py-3' width={'100%'} style={{background: 'rgb(242, 243, 244)'}}>

            <h2 className='mb-3 text-center'>Polecane <span className='text-success'>oferty</span></h2>

            <div className='d-flex justify-content-center mb-3'>
                {data.map((item, index) =>
                    <Link key={index} to={`/${item.category}/${item.id}-${item.title.split(' ').join('-')}`}>
                        <div style={{ position: 'relative' }}
                            className={`d-flex-col mx-2 ${index < 3 ? 'd-none d-lg-block' : 'd-none'}`}>
                            <img src={item.firstPhoto} alt={"Zdjęcie polecanej oferty " + index} width={300} height={300} style={{ objectFit: 'cover' }}></img>
                            <div className=""
                                style={{
                                    height: '300px', width: '300px', position: 'absolute',
                                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6))'
                                }}></div>
                            <div className='p-3 text-light' style={{ position: 'absolute', bottom: 0 }}>
                                <div className=''><b>{item.price} {item.price_unit}</b></div>
                                <div>{item.location_text} {item.category}</div>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}
                            className={`d-flex-col mx-2 ${index < 2 ? 'd-lg-none d-sm-block d-none' : 'd-none'}`} >
                            <img src={item.firstPhoto} alt={"Zdjęcie polecanej oferty " + index} width={300} height={300} style={{ objectFit: 'cover' }}></img>
                            <div className=""
                                style={{
                                    height: '300px', width: '300px', position: 'absolute',
                                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6))'
                                }}></div>
                            <div className='p-3 text-light' style={{ position: 'absolute', bottom: 0 }}>
                                <div className=''><b>{item.price} {item.price_unit}</b></div>
                                <div>{item.location_text} {item.category}</div>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}
                            className={`d-flex-col mx-2 ${index < 1 ? 'd-sm-none d-xs-block' : 'd-none'}`} >
                            <img src={item.firstPhoto} alt={"Zdjęcie polecanej oferty " + index} width={300} height={300} style={{ objectFit: 'cover' }}></img>
                            <div className=""
                                style={{
                                    height: '300px', width: '300px', position: 'absolute',
                                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6))'
                                }}></div>
                            <div className='p-3 text-light' style={{ position: 'absolute', bottom: 0 }}>
                                <div className=''><b>{item.price} {item.price_unit}</b></div>
                                <div>{item.location_text} {item.category}</div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
            <div className='d-flex justify-content-center'>
                {data.map((item, index) =>
                    <Link to={`/${item.category}/${item.id}-${item.title.split(' ').join('-')}`}>
                        <div style={{ position: 'relative' }}
                            className={`d-flex-col mx-2 ${index >= 3 ? 'd-none d-lg-block' : 'd-none'}`} key={(index+1)*33}>
                            <img src={item.firstPhoto} alt={"Zdjęcie polecanej oferty " + index} width={300} height={300} style={{ objectFit: 'cover' }}></img>
                            <div className=""
                                style={{
                                    height: '300px', width: '300px', position: 'absolute',
                                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6))'
                                }}></div>
                            <div className='p-3 text-light' style={{ position: 'absolute', bottom: 0 }}>
                                <div className=''><b>{item.price} {item.price_unit}</b></div>
                                <div>{item.location_text} {item.category}</div>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}
                            className={`d-flex-col mx-2 ${index > 3 ? 'd-lg-none d-sm-block d-none' : 'd-none'}`} key={(index+1)*22}>
                            <img src={item.firstPhoto} alt={"Zdjęcie polecanej oferty " + index} width={300} height={300} style={{ objectFit: 'cover' }}></img>
                            <div className=""
                                style={{
                                    height: '300px', width: '300px', position: 'absolute',
                                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6))'
                                }}></div>
                            <div className='p-3 text-light' style={{ position: 'absolute', bottom: 0 }}>
                                <div className=''><b>{item.price} {item.price_unit}</b></div>
                                <div>{item.location_text} {item.category}</div>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}
                            className={`d-flex-col mx-2 ${index >4 ? 'd-sm-none d-xs-block' : 'd-none'}`} key={(index+1)*14}>
                            <img src={item.firstPhoto} alt={"Zdjęcie polecanej oferty " + index} width={300} height={300} style={{ objectFit: 'cover' }}></img>
                            <div className=""
                                style={{
                                    height: '300px', width: '300px', position: 'absolute',
                                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6))'
                                }}></div>
                            <div className='p-3 text-light' style={{ position: 'absolute', bottom: 0 }}>
                                <div className=''><b>{item.price} {item.price_unit}</b></div>
                                <div>{item.location_text} {item.category}</div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

        </div>
    )
}

export default Recom