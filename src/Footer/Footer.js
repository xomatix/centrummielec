import React from "react";

function Footer() {
  return (
    <div>
      <div
        className="flex justify-center items-center bg-cover bg-bottom"
        style={{
          backgroundImage:
            "url('https://centrummielec.pl/api/static/footer.png')",
          minHeight: 200,
          backgroundRepeat: "repeat-x",
        }}
      >
        <div className="flex flex-col items-center p-4 mt-2">
          <img
            className="pt-1 mb-2"
            src="https://centrummielec.pl/api/static/footer_badge.png"
            alt="odznaka zatwierdzona"
            width={50}
            height={50}
          />
          <h2 className="text-center p-2 text-success text-lg font-semibold hidden md:block">
            DOŁĄCZ DO GRONA NASZYCH KLIENTÓW!
          </h2>
        </div>
      </div>
      <div className="text-center text-secondary py-4 bg-gray-100">
        <span className="text-sm" style={{ userSelect: "none" }}>
          powered by Mateusz Świerczek
        </span>
      </div>
    </div>
  );
}

export default Footer;
