import React from 'react';
import Recom from '../Recom/Recom';
import CatSelect from '../CatSelect/CatSelect';
import { Link } from 'react-router-dom';
import Advantages from './Advantages';

function Home() {
  return (
    <div>
      <CatSelect />
      <Recom />
      <Advantages />
      <div className='text-center mx-auto my-5'>
        <Link to='/zrealizowane' >
          <button className='btn btn-success btn-lg'>Sprawdź zrealizowane przez nas oferty</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;