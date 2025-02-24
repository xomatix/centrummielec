import React from "react";
import { FaPrint } from "react-icons/fa";
import { baseApiUrl, baseContact } from "../Variables";

function PrintLayout({ offer }) {
  const layoutStyle = {
    margin: "0 auto",
  };

  return (
    <div className="print-section" style={layoutStyle}>
      <div className="justify-between mb-4 w-100 relative">
        <img
          src={`${baseApiUrl}/static/logo.png`}
          className="h-[4.75rem]"
          alt="CentrumMielec Logo"
        />
        <div className="absolute top-[-15px] right-0 text-md">
          <div>{baseContact.location}</div>
          <div>{baseContact.email}</div>
          <div>centrummielec.pl</div>
          <div>602-575-735 | 730-582-885</div>
        </div>
      </div>
      <img
        alt="zdjęcie oferty"
        className="w-full h-90 object-cover"
        src={baseApiUrl + "/" + offer.firstPhoto}
      />
      <h1 className="text-xl mt-2 font-semibold">{offer.title}</h1>
      <div className="flex">
        <div className="font-normal text-gray-800 text-md">
          Cena: {offer.price} {offer.price_unit} |{" "}
          {Math.floor(offer.price / offer.size)} {offer.price_unit}/
          {offer.size_unit}
        </div>
      </div>
      <div className="flex">
        <div className="font-normal text-gray-800 text-md">
          Powierzchnia: {offer.size} {offer.size_unit}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-md font-bold">Opis:</div>
        <div
          className="parent-div"
          id="description-rendered"
          dangerouslySetInnerHTML={{ __html: `${offer.description}` }}
        ></div>
      </div>
    </div>
  );
}

function PrintButton({ offer }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <PrintLayout offer={offer}></PrintLayout>
      <button className="scale-125 mr-1 print:hidden" onClick={handlePrint}>
        <FaPrint />
      </button>
    </>
  );
}

export default PrintButton;
