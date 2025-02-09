import React from "react";

function Advantages() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-center text-3xl font-semibold mb-6">
        Nasze <span className="text-green-600">Zalety</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center items-center mx-auto px-4 max-w-4xl">
        <div className="w-full sm:h-[400px] md:h-[350px] p-6 bg-white border border-green-600 border-2 rounded-lg shadow">
          <h5 className="mb-4 text-2xl font-bold tracking-tight text-green-600">
            PROFESJONALIZM DOŚWIADCZENIE ZAUFANIE
          </h5>
          <p className="text-gray-700">
            Biuro <b className="text-green-600">Centrum-Nieruchomości</b>
            <br />
            jest jednym z pierwszych biur na rynku mieleckim. Działamy od 1999
            roku, początkowo pod nazwą{" "}
            <b className="text-green-600">Blaster Nieruchomości</b>. Mamy
            olbrzymie doświadczenie na rynku mieleckim. Współpracujemy z
            inwestorami, klientami instytucjonalnymi i indywidualnymi. Klienci
            chętnie do nas wracają. Możemy się pochwalić szerokim gronem
            zadowolonych klientów.
          </p>
        </div>

        <div className="w-full sm:h-[400px] md:h-[350px] p-6 bg-white border border-green-600 border-2 rounded-lg shadow">
          <h5 className="mb-4 text-2xl font-bold tracking-tight text-green-600">
            PROWADZIMY WYCENĘ NIERUCHOMOŚCI POD SPRZEDAŻ
          </h5>
          <p className="text-gray-700">
            Trafna wycena nieruchomości kluczem do szybkiej sprzedaży. Podstawą
            trafnej, realnej wyceny nieruchomości jest znajomość określonego
            rynku nieruchomości, specyfiki konkretnych lokalizacji, typu
            budownictwa, rynkowych cen prac remontowych i wykończeniowych, a
            także cen transakcyjnych oraz cen ofertowych.
            <br />
            <b className="text-green-600">ZAUFAJ NAM</b>
          </p>
        </div>

        <div className="w-full sm:h-[150px] md:h-[125px] p-6 bg-white border border-green-600 border-2 rounded-lg shadow">
          <p className="text-gray-700">
            KREDYTY HIPOTECZNE.{" "}
            <b className="text-green-600">
              BEZPŁATNA OPIEKA DOŚWIADCZONEGO DORADCY FINANSOWEGO
            </b>
            . WIELE BANKÓW W JEDNYM MIEJSCU
          </p>
        </div>

        <div className="w-full sm:h-[150px] md:h-[125px] p-6 bg-white border border-green-600 border-2 rounded-lg shadow">
          <p className="text-gray-700">
            Chcesz szybko sprzedać{" "}
            <b className="text-green-600">DOM DZIAŁKĘ MIESZKANIE LOKAL</b>?
            Skorzystaj z naszego <b className="text-green-600">DOŚWIADCZENIA</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;
