import React from 'react';
import { Link } from 'react-router-dom';
import Recom from '../Recom/Recom';
import CatSelect from '../CatSelect/CatSelect';

function Home() {
  return (
    <div>
      <CatSelect/>
      <Recom/>
    </div>
  );
}

export default Home;