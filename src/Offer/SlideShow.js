import React, { useEffect, useState } from 'react'
import { baseApiUrl } from '../Variables'

function SlideShow({ photosUrls }) {
    const [photos, setPhotos] = useState([])
    const [mainPhoto, setMainPhoto] = useState(0)
    const [mainPhotoOpen, setMainPhotoOpen] = useState(false)

    useEffect(() => {
        setPhotos([...photosUrls])

        // window.addEventListener('keyup', (e) => {
        //     e.preventDefault()
        //     switch (e.key) {
        //         case 'ArrowRight':
        //             handleButtonClick(e, 1)
        //             break;
        //         case 'ArrowLeft':
        //             handleButtonClick(e, -1)
        //             break;

        //         default:
        //             break;
        //     }
        // })

    }, [photosUrls])

    const handleButtonClick = (e, step) => {
        e.preventDefault()
        if (step === 1) {
            setMainPhoto((mainPhoto + 1) % photos.length)
            console.log(mainPhoto)
        } else {
            setMainPhoto(mainPhoto === 0 ? photos.length - 1 : mainPhoto - 1)
            console.log(mainPhoto)
        }
    }

    const handlePhotoClick = (e, index) => {
        e.preventDefault()
        setMainPhoto(index);
    }

    const closeMainPhoto = (e) => {
        e.preventDefault()
        setMainPhotoOpen(false);
    }

    return (
        <div className="overflow-hidden">
            <div style={{ position: 'relative' , zIndex: 1}}>
                {photos.map((item, index) =>
                    <div key={index + 100} className={` ${mainPhoto === index ? 'd-block' : 'd-none'}`} >
                        <div className={`bg-dark ${mainPhotoOpen === true ? 'd-block' : 'd-none'}`}
                            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
                            <img loading='lazy' src={`${baseApiUrl}/${item}`} height={'100%'} width={'100%'}
                                style={{ objectFit: 'contain', position: 'relative' }} alt={`Zdjęcie numer ${index}`} />

                            <button type='button' className='btn bg-secondary bg-opacity-25 text-light '
                                style={{ position: 'absolute', right: 0, top: 0, fontSize: '2.5rem' }}
                                onClick={e => { closeMainPhoto(e) }}>&#10005;</button>

                            <div className="p-2 m-3 text-light bg-dark bg-opacity-75" style={{ position: 'absolute', right: 0, bottom: 0 }} >{index + 1} / {photos.length}</div>
                            <button className="prev btn text-light bg-secondary bg-opacity-25" onClick={e => handleButtonClick(e, -1)}
                                style={{ position: 'absolute', left: 5, top: '50%', fontSize: '2.5rem', transform: 'translate(0,-50%)' }}>&#10094;</button>
                            <button className="next btn text-light bg-secondary bg-opacity-25" onClick={e => handleButtonClick(e, 1)}
                                style={{ position: 'absolute', right: 5, top: '50%', fontSize: '2.5rem', transform: 'translate(0,-50%)' }} >&#10095;</button>
                        </div>

                        <div className={` ${mainPhotoOpen === true ? 'd-none' : 'd-block'}`} >
                            <div onClick={e => { e.preventDefault(); setMainPhotoOpen(true);}}>
                                <img loading='lazy' src={`${baseApiUrl}/${item}`} height={'600px'} className='d-none d-md-block' style={{ width: '100%', objectFit: 'cover' }} alt={`Zdjęcie numer ${index}`} />
                                <img loading='lazy' src={`${baseApiUrl}/${item}`} height={'300px'} className='d-block d-md-none ' style={{ width: '100%', objectFit: 'cover' }} alt={`Zdjęcie numer ${index}`} />
                            </div>
                            <div className="p-2 m-3 text-light bg-dark bg-opacity-75" style={{ position: 'absolute', right: 0, bottom: 0 }} >{index + 1} / {photos.length}</div>

                            <button className="prev btn text-light bg-dark bg-opacity-25 " onClick={e => handleButtonClick(e, -1)}
                                style={{ position: 'absolute', left: 5, top: '50%', fontSize: '2.5rem', transform: 'translate(0,-50%)' }}>&#10094;</button>
                            <button className="next btn text-light bg-dark bg-opacity-25" onClick={e => handleButtonClick(e, 1)}
                                style={{ position: 'absolute', right: 5, top: '50%', fontSize: '2.5rem', transform: 'translate(0,-50%)' }} >&#10095;</button>
                        </div>


                    </div>
                )}
            </div>

            <div className='d-flex overflow-auto mt-2'>
                {photos.map((item, index) =>
                    <div key={index} className='flex-column me-2'>
                        <img src={`${baseApiUrl}/${item}`} height='98px' alt={`Zdjęcie numer ${index}`} onClick={(e) => handlePhotoClick(e, index)} />
                    </div>
                )}
            </div>

        </div>
    )
}

export default SlideShow