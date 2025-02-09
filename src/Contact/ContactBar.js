import React from "react";
import { baseApiUrl } from "../Variables";

function ContactBar() {
  const contactStyle = "p-5 w-100 flex gap-2 mx-auto";
  const imageStyle = "object-contain";
  const ClockIcon = `${baseApiUrl}/static/ic_czas.png`;
  const PhoneIcon = `${baseApiUrl}/static/ic_telefon.png`;
  const AddressIcon = `${baseApiUrl}/static/ic_adres.png`;

  return (
    <div className="w-100 mx-auto grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center justify-between">
      <div className={contactStyle}>
        <img src={AddressIcon} alt="Addres ico" className={imageStyle} />
        <p>Ul. Szeroka 1 39-300 Mielec</p>
      </div>
      <div className={contactStyle}>
        <img src={ClockIcon} alt="Clock ico" className={imageStyle} />
        <p>9:00 - 19:00</p>
      </div>
      <div className={contactStyle}>
        <img src={AddressIcon} alt="Addres ico" className={imageStyle} />
        <a className="text-green-600" href="mailto:biuro@centrummielec.pl">
          biuro@centrummielec.pl
        </a>
      </div>
      <div className={contactStyle}>
        <img src={PhoneIcon} alt="Phone ico" className={imageStyle} />
        <div className="flex xl:flex-row flex-col gap-1">
          <a className="text-green-600" href="tel:602575735">
            +48 602 57 57 35
          </a>
          <div className="hidden xl:block ">|</div>
          <a className="text-green-600" href="tel:730582885">
            +48 730 58 28 85
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactBar;
