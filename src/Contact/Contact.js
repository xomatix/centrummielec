import React from "react";
import { baseApiUrl } from "../Variables";

function Contact() {
  return (
    <div className="container mx-auto my-10 p-5">
      <h2 className="text-3xl font-semibold text-center text-success my-5">
        Kontakt
      </h2>
      <hr className="my-5 border-green-600" />

      <div className="lg:flex lg:justify-between">
        <div className="lg:w-1/2 p-5">
          <p className="text-lg mb-4">
            Jeżeli chcesz się dowiedzieć o danej ofercie więcej, a nie masz
            czasu by przyjść do naszego biura, zadzwoń lub skontaktuj się
            poprzez pocztę elektroniczną. Chętnie udzielimy Ci więcej
            informacji, prześlemy dodatkowe zdjęcia (e-mail).
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
          </div>

          <p className="mb-4">
            Adres: Ul. Szeroka 1<br />
            39-300 Mielec
            <br />
            <br />
            Monika Piotrowska:{" "}
            <a className="text-green-600" href="tel:602575735">
              +48 602 57 57 35
            </a>
            <br />
            Aneta Wyzina:{" "}
            <a className="text-green-600" href="tel:730582885">
              +48 730 58 28 85
            </a>
            <br />
            e-mail:{" "}
            <a className="text-green-600" href="mailto:biuro@centrummielec.pl">
              biuro@centrummielec.pl
            </a>
            <br />
            <a
              className="text-green-600"
              href="http://www.centrummielec.pl"
              target="_blank"
              rel="noreferrer"
            >
              www.centrummielec.pl
            </a>
          </p>
        </div>

        <div className="lg:w-1/2 my-auto">
          <img
            src={`${baseApiUrl}/static/biuro_1.jpg`}
            alt="Zdjęcie biura"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>

      <iframe
        className="mt-5 rounded-lg shadow-lg"
        title="mapa"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d159.32912744917203!2d21.419253291059853!3d50.286961607867454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473d6b707d39196f%3A0xf46bdd8cd9faf3ee!2sAl.Szeroka%201%2C%2039-300%20Mielec!5e0!3m2!1spl!2spl!4v1695468968581!5m2!1spl!2spl"
        width="100%"
        height="500"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default Contact;
