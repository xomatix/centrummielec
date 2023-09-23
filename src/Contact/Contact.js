import React from 'react'
import { baseApiUrl } from '../Variables'

function Contact() {

    return (
        <div className='container my-auto' >
            <h2 className='mx-auto my-5 text-center'>Kontakt</h2>
            <hr class="hr my-auto" />
            <div className="d-lg-flex">
                <div className="col-lg-6 p-5">
                    <p >
                        Jeżeli chcesz się dowiedzieć o danej ofercie więcej, a nie masz czasu by przyjść do naszego biura zadzwoń lub skontaktuj się poprzez pocztę elektroniczną.
                        Chętnie udzielimy Ci więcej informacji, prześlemy dodatkowe zdjęcia (e-mail).
                    </p>
                    <div className='d-flex'>
                        <p className='col-6'>
                            Godziny otwarcia biura:
                        </p>
                        <p className='col-6'>
                            9:00 - 15:00 (poniedziałek - piątek)
                        </p>

                    </div>
                    <div className='d-flex'>
                        <p className='col-6'>
                            Praca w terenie:
                        </p>
                        <p className='col-6'>
                            9:00 - 19:00 (poniedziałek - piątek)<br />
                            9:00 - 13:00 (sobota)
                        </p>
                    </div>
                    <p>
                        Adres: Ul. Szeroka 1<br/>
                        39-300 Mielec<br/>
                        Tel: 17 788 51 37<br/>
                        <br/>
                        Monika Piotrowska:  <a href='tel:602575735'>602 57 57 35</a><br/>
                        Aneta Wyzina:   <a href='tel:730582885'>730 58 28 85</a><br/>
                        e-mail: <a href = "mailto: biuro@centrummielec.pl">biuro@centrummielec.pl</a><br/>
                        <a href = "http://www.centrummielec.pl" target="_blank" rel="noreferrer">www.centrummielec.pl</a>
                    </p>
                </div>
                <div className="col-lg-6 my-auto">
                    <img src={`${baseApiUrl}/static/biuro_1.jpg`} alt="Zdjęcie biura" width={'100%'} />
                    {/* <img src={`${baseApiUrl}/static/biuro_2.jpg`} alt="Zdjęcie biura" /> */}
                </div>
            </div>
                <iframe className="mt-5" title='mapa' src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d159.32912744917203!2d21.419253291059853!3d50.286961607867454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473d6b707d39196f%3A0xf46bdd8cd9faf3ee!2sAl.Szeroka%201%2C%2039-300%20Mielec!5e0!3m2!1spl!2spl!4v1695468968581!5m2!1spl!2spl" 
                width="100%" height="500" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    )
}

export default Contact