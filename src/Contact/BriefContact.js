import React from "react";
import { baseApiUrl } from "../Variables";

function BriefContact() {
  return (
    <div className="p-3 bg-white rounded shadow shadow-md">
      <div className="mb-4 font-bold text-3xl text-center">Kontakt</div>
      <hr className="my-2 border-green-600" />

      <div className="lg:flex lg:justify-between">
        {/* Contact Information Section */}
        <div className="w-full p-5">
          {/* Contact Details */}
          <p className="mb-2">
            Monika Piotrowska:{" "}
            <a className="text-green-600 font-bold" href="tel:602575735">
              +48 602 57 57 35
            </a>
            <br />
            Aneta Wyzina:{" "}
            <a className="text-green-600 font-bold" href="tel:730582885">
              +48 730 58 28 85
            </a>
            <br />
            e-mail:{" "}
            <a
              className="text-green-600 font-bold"
              href="mailto:biuro@centrummielec.pl"
            >
              biuro@centrummielec.pl
            </a>
          </p>

          <div className="mb-4">
            <p className="font-semibold">Godziny otwarcia biura:</p>
            <p>9:00 - 15:00 (poniedziałek - piątek)</p>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Praca w terenie:</p>
            <p>
              9:00 - 19:00 (poniedziałek - piątek)
              <br />
              9:00 - 13:00 (sobota)
            </p>
            Adres: Ul. Szeroka 1 39-300 Mielec
          </div>
        </div>
      </div>
    </div>
  );
}

export default BriefContact;
