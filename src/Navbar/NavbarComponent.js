import React, { useEffect } from "react";
import "flowbite";
import { baseApiUrl } from "../Variables";

function NavbarComponent() {
  useEffect(() => {
    import("flowbite").then(({ initDropdowns }) => {
      initDropdowns();
    });
  }, []);

  return (
    <nav className="bg-white border-gray-200 ">
      <div className="max-w-screen-2xl inline-block flex flex-wrap items-center justify-between align-center mx-auto p-4">
        <a href="/" className="flex items-center space-x-3">
          <img
            src={`${baseApiUrl}/static/logo.png`}
            className="h-11"
            alt="CentrumMielec Logo"
          />
        </a>

        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className="hidden w-full md:block md:w-auto mt-3"
          id="navbar-dropdown"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg bg-white md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <a
                href="/mieszkania"
                className="block py-2 px-3 bg-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600 md:p-0"
                aria-current="page"
              >
                Mieszkania
              </a>
            </li>
            <li>
              <a
                href="/domy"
                className="block py-2 px-3 bg-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0"
                aria-current="page"
              >
                Domy
              </a>
            </li>
            <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0 md:w-auto"
              >
                Działki{" "}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {/* Dropdown menu */}
              <div
                id="dropdownNavbar"
                className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
              >
                <ul
                  className="py-2 mx-auto text-sm text-gray-700"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a
                      href="/dzialki/mielec"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Działki w Mielcu
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dzialki/poza-mielcem"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Działki poza Mielcem
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar2"
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0 md:w-auto"
              >
                Lokale{" "}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {/* Dropdown menu */}
              <div
                id="dropdownNavbar2"
                className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
              >
                <ul
                  className="py-2 mx-auto text-sm text-gray-700"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a
                      href="/lokale"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Lokale na sprzedaż
                    </a>
                  </li>
                  <li>
                    <a
                      href="/lokale/wynajem"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Lokale na wynajem
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a
                href="/mieszkania/wynajem"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0"
              >
                Wynajem Mieszkań
              </a>
            </li>
            <li>
              <a
                href="/kontakt"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0"
              >
                Kontakt
              </a>
            </li>

            {localStorage.getItem("token") !== null && (
              <>
                <li>
                  <a
                    href="/dodaj"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0"
                  >
                    Dodaj oferte
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-600  md:p-0"
                  >
                    Logowanie
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
