import React from 'react';

function Hintbar() {
  
  const elementstyle = "lg:w-32 h-1 w-[85%]";

  return (
    <div className="flex lg:flex-row flex-col items-center justify-center w-full py-5 shadow-lg">
      <div className={`${elementstyle}`} style={{ backgroundColor: '#77c8a7' }}></div>
      <div className="text-gray-700 font-medium text-xl mx-5 p-2 whitespace-nowrap">SZYBKA SPRZEDAŻ</div>
      <div className={`${elementstyle}`} style={{ backgroundColor: '#e2e76f' }}></div>
      <div className="text-gray-700 font-medium text-xl mx-5 p-2 whitespace-nowrap">PROFESJONALIZM</div>
      <div className={`${elementstyle}`} style={{ backgroundColor: '#cbe7d0' }}></div>
      <div className="text-gray-700 font-medium text-xl mx-5 p-2 whitespace-nowrap">DOŚWIADCZENIE</div>
      <div className={`${elementstyle}`} style={{ backgroundColor: '#d7e037' }}></div>
    </div>
  );
}

export default Hintbar;