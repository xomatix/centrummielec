import React from 'react'

function Footer() {
    return (
        <div>
            <div className="d-flex justify-content-center"
                style={{ background: "url('https://centrummielec.pl/api/static/footer.png')", position: 'relative', minHeight: 200, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom' }}>
                <div className="d-flex p-4 mt-2 ">
                    <img className="pt-1 mx-auto d-block" src="https://centrummielec.pl/api/static/footer_badge.png" alt="odznaka zatwierdzona" width={50} height={50} />
                    <h2 className='text-center p-2 text-success d-none d-md-block'>DOŁĄCZ DO GRONA NASZYCH KLIENTÓW!</h2>
                    <h5 className='text-center p-2 text-success d-md-none '>DOŁĄCZ DO GRONA NASZYCH KLIENTÓW!</h5>
                </div>

            </div>
        </div>
    )
}

export default Footer