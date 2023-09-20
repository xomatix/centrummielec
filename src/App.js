
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home/Home'; // Import your existing components
import Offers from './Offers/Offers'; // Import the Offers component
import Offer from './Offer/Offer';
import Login from './Login/Login';
import EditOffer from './Offer/EditOffer';
import { RefreshToken } from './Login/Login';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      RefreshToken();
      //console.log("Refresh token fuinction start");
    }, 240 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav className='navbar navbar-expand-md navbar-dark' style={{'background': '#464B53'}}>
          <div className='container'>
            <Link to="/" className='navbar-brand'>Logo</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse text-center " id="navbarNav">
              <ul className="navbar-nav ms-auto ">
                <li className="nav-item" active><Link to="/mieszkania" className="nav-link text-light">Mieszkania</Link></li> {/* Link to the Offers page */}
                <li className="nav-item"><Link to="/domy" className="nav-link text-light">Domy</Link></li>
                <li className="nav-item"><Link to="/dzialki" className="nav-link text-light">Działki</Link></li>
                <li className="nav-item"><Link to="/lokale" className="nav-link text-light">Lokale</Link></li>
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
          {localStorage.getItem('token') !== null && <Route path="/dodaj/" element={<EditOffer />} />}
          <Route path="/:category/" element={<Offers />} />
          <Route path="/:category/:id" element={<Offer />} /> {/* Offers page */}
          <Route path="/:category/:id/edytuj" element={<EditOffer />} /> {/* Offers page */}
        </Routes>
      </div>

      {/* footer */}
      <footer>Footer</footer>
    </Router >
  );
}

export default App;
