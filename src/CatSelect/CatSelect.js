import React, { useState } from 'react'

function CatSelect() {
    const [selectedCategory, setSelectedCategory] = useState('Mieszkania')

    const handleButtonPressed = (e) => {
        e.preventDefault()

        console.log(selectedCategory.toLowerCase())
        switch (selectedCategory.toLowerCase()) {
            case 'mieszkania':
                window.location = '/mieszkania'
                break;
            case 'mieszkania na wynajem':
                window.location = '/mieszkania/wynajem'
                break;
            case 'działki w mielcu':
                window.location = '/dzialki/mielec'
                break;
            case 'działki poza mielcem':
                window.location = '/dzialki/poza-mielcem'
                break;
            case 'domy':
                window.location = '/domy'
                break;
            case 'lokale na sprzedaż':
                window.location = '/lokale'
                break;
            case 'lokale na wynajem':
                window.location = '/lokale/wynajem'
                break;

            default:
                break;
        }
    }

    const handleValueChange = (e) => {
        e.preventDefault()
        setSelectedCategory(e.target.value)
    }

    return (
        <div>
            <div className='main' height={500} style={{ position: 'relative' }}>
                <img src='https://centrummielec.pl/api/static/back_front.jpg' width={'100%'} height={500}
                    style={{ objectFit: 'cover', top: 0, left: 0 }} alt='tło' />
                <div style={{
                    height: '100%', width: '100%', position: 'absolute',
                    top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.7))'
                }}></div>
                <div className='row d-flex flex-column text-center mx-auto' 
                style={{minWidth:300, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                    <div className='mb-5 text-light'>
                        <h2>Hasło tytułowe</h2>

                    </div>
                    <div className=' p-4 d-flex justify-content-around' style={{background: '#F2F3F4'}}>
                        <div class="form-group me-3">
                            {/* <label for="formControlSelect">Czego szukasz?</label> */}
                            <select class="form-control" id="formControlSelect" value={selectedCategory} onChange={e => handleValueChange(e)} placeholder="">
                                <option>Mieszkania</option>
                                <option>Mieszkania na wynajem</option>
                                <option>Domy</option>
                                <option>Działki w Mielcu</option>
                                <option>Działki poza Mielcem</option>
                                <option>Lokale na sprzedaż</option>
                                <option>Lokale na wynajem</option>
                            </select>
                        </div>

                        <button className='btn btn-success ' type='button' onClick={e => handleButtonPressed(e)}>Szukaj</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatSelect