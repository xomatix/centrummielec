import React from "react";
import { FaPrint } from "react-icons/fa";

function PrintLayout({ offer }) {
  const layoutStyle = {
    margin: "0 auto",
  };

  return (
    <div className="print-section" style={layoutStyle}>
      <h1 className="">{offer.title}</h1>
      <div className="flex">
        <div className="font-normal text-gray-500 text-sm">Powierzchnia</div>
        <div className="font-semibold text-lg">
          {offer.size} {offer.size_unit}
        </div>
      </div>
      <p>{offer.desc}</p>
      {/* {Math.floor(data.price / data.size)} {data.price_unit}/
                    {data.size_unit} */}
      <div className="">
        <div className="text-2xl font-bold">Opis:</div>
        <div
          className="parent-div"
          id="description-rendered"
          dangerouslySetInnerHTML={{ __html: `${offer.description}` }}
        ></div>
      </div>
      {offer.price_text} {offer.price_unit}
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
      <button className="scale-125 mr-1" onClick={handlePrint}>
        <FaPrint />
      </button>
    </>
  );
}

export default PrintButton;
