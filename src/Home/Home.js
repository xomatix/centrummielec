import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Explore our <Link to="/mieszkania">mieszkania</Link>.</p> {/* Link to the Offers page */}
    </div>
  );
}

export default Home;