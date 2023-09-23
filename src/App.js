
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home/Home'; // Import your existing components
import Offers from './Offers/Offers'; // Import the Offers component
import Offer from './Offer/Offer';
import Login from './Login/Login';
import EditOffer from './Offer/EditOffer';
import { RefreshToken } from './Login/Login';
import { useEffect } from 'react';
import { baseApiUrl } from './Variables';
import Footer from './Footer/Footer';
import Contact from './Contact/Contact';

function App() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      RefreshToken();
      //console.log("Refresh token fuinction start");
    }, 120 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav className='navbar navbar-expand-lg navbar-dark' style={{ 'background': '#464B53' }}>
          <div className='container'>
            <Link to="/" className='navbar-brand'><img src={`${baseApiUrl}/static/logo-b.png`} width="120" height="100%" className="d-inline-block align-top" alt="Centrum Nieruchomości Mielec Logo"/></Link>
            <button
              className="navbar-toggler border-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon " ></span>
            </button>
            <div className="collapse navbar-collapse text-center " id="navbarNav">
              <ul className="navbar-nav ms-auto ">
                <li className="nav-item"><Link to="/mieszkania" className="nav-link text-light">Mieszkania</Link></li> {/* Link to the Offers page */}
                <li className="nav-item"><Link to="/domy" className="nav-link text-light">Domy</Link></li>
                <li className="nav-item dropdown">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                  <div className="nav-link dropdown-toggle text-light " type='button' data-bs-toggle="dropdown" aria-expanded="false">Działki</div>
                  <ul className='dropdown-menu'>
                    <li className="dropdown-item"><Link to="/dzialki/mielec" className="dropdown-item nav-link text-dark">Działki w Mielcu</Link></li>
                    <li className=" dropdown-item"><Link to="/dzialki/poza-mielcem" className="dropdown-item nav-link text-dark">Działki poza Mielcem</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                  <div className="nav-link dropdown-toggle text-light " type='button' data-bs-toggle="dropdown" aria-expanded="false">Lokale</div>
                  <ul className='dropdown-menu'>
                    <li className="dropdown-item"><Link to="/lokale" className="dropdown-item nav-link text-dark">Lokale na sprzedaż</Link></li>
                    <li className=" dropdown-item"><Link to="/lokale/wynajem" className="dropdown-item nav-link text-dark">Lokale na wynajem</Link></li>
                  </ul>
                </li>
                <li className="nav-item"><Link to="/mieszkania/wynajem" className="nav-link text-light">Wynajem Mieszkań</Link></li>
                <li className="nav-item"><Link  to="/kontakt" className="nav-link text-light">Kontakt</Link></li>
                {localStorage.getItem('token') !== null && <li className="nav-item"><Link to="/dodaj" className="nav-link text-light">➕ Dodaj oferte</Link></li>}
                {localStorage.getItem('token') !== null && <li className="nav-item"><Link to="/login" className="nav-link text-light">🔑 Logowanie</Link></li>}
              </ul>
            </div>
          </div>
        </nav>

        {/* Route configuration */}
        <Routes>
          <Route path="/" exact element={<Home />} /> {/* Home page */}
          <Route path="/login/" element={<Login />} /> {/* Offers page */}
          <Route path="/kontakt" element={<Contact />} /> {/* Offers page */}
          {localStorage.getItem('token') !== null && <Route path="/dodaj/" element={<EditOffer />} />}
          <Route path="/:category/wynajem" element={<Offers rent={true} />} />
          <Route path="/:category/mielec" element={<Offers mielec={true} />} />
          <Route path="/:category/poza-mielcem" element={<Offers mielec={false} />} />
          <Route path="/:category/" element={<Offers />} />
          <Route path="/:category/:id" element={<Offer />} /> {/* Offers page */}
          <Route path="/:category/:id/edytuj" element={<EditOffer />} /> {/* Offers page */}
        </Routes>
      </div>

      {/* footer */}
      <Footer />
    </Router >
  );
}

export default App;
