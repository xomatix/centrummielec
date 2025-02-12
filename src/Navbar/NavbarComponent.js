import React, { useState } from "react";
import { baseApiUrl } from "../Variables";
import { Link } from "react-router-dom";
import ContactBar from "../Contact/ContactBar";

function NavbarComponent() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuDzialki, setShowMenuDzialki] = useState(false);
  const [showMenuLokale, setShowMenuLokale] = useState(false);

  const navbarLinkBaseClass =
    "block py-2  px-2 mx-1 bg-white hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-green-600 xl:px-4 lg:border-t-4 lg:border-0";

  return (
    <nav className="bg-white border-gray-200 ">
      <div className="max-w-screen-2xl 2xl:mt-5 flex flex-wrap items-center justify-between align-center mx-auto p-4 shadow-lg 2xl:rounded">
        <Link to="/">
          <div className="flex items-center space-x-3 left-[50%]">
            <img
              src={`${baseApiUrl}/static/logo.png`}
              className="h-[4.75rem]"
              alt="CentrumMielec Logo"
            />
          </div>
        </Link>

        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-dropdown"
          onClick={() => setShowMenu(!showMenu)}
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
          className={`${!showMenu && "hidden"} w-full lg:block lg:w-auto mt-3`}
          id="navbar-dropdown"
        >
          <ul className="flex flex-col text-lg font-semibold p-4 lg:p-0 mt-4 rounded-lg bg-white w-100 lg:flex-row lg:mt-0 lg:border-0 lg:bg-white">
            <li onClick= {() => setShowMenu(false)}>
              <Link
                to="/mieszkania"
                className={`${navbarLinkBaseClass} border-t-[#77C8A6] `}
                aria-current="page"
              >
                MIESZKANIA
              </Link>
            </li>
            <li onClick= {() => setShowMenu(false)}>
              <Link
                to="/domy"
                className={`${navbarLinkBaseClass} border-t-[#BAB7B8] `}
                aria-current="page"
              >
                DOMY
              </Link>
            </li>
            <li
            onMouseEnter={() => setShowMenuDzialki(true)}
            onMouseLeave={() => setShowMenuDzialki(false)}
            className="lg:relative">
              <button
                id="dropdownNavbarLink"
                
                
              
                className={`flex items-center justify-between  ${navbarLinkBaseClass} border-t-[#D6E037]`}
              >
                DZIAŁKI{" "}
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
                className={`z-10 font-semibold bg-white divide-y divide-gray-100 rounded-lg shadow w-44 lg:absolute ${
                  showMenuDzialki ? "" : "hidden"
                }`}
              >
                <ul onClick= {() => setShowMenu(false)}
                  className="py-2 mx-auto text-sm text-gray-700"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <Link
                      to="/dzialki/mielec"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      DZIAŁKI w Mielcu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dzialki/poza-mielcem"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      DZIAŁKI poza Mielcem
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
            onMouseEnter={() => setShowMenuLokale(true)}
            onMouseLeave={() => setShowMenuLokale(false)}
            className="lg:relative">
              <button
                id="dropdownNavbarLink"
                
                className={`flex items-center justify-between  ${navbarLinkBaseClass} border-t-[#CBE7CF]`}
              >
                LOKALE{" "}
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
                className={`z-10  font-semibold bg-white divide-y divide-gray-100 rounded-lg shadow w-44 lg:absolute ${
                  showMenuLokale ? "" : "hidden"
                }`}
              >
                <ul onClick= {() => setShowMenu(false)}
                  className="py-2 mx-auto text-sm text-gray-700"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <Link
                      to="/lokale"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      LOKALE na sprzedaż
                    </Link>
                  </li>
                  <li >
                    <Link
                      to="/lokale/wynajem"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      LOKALE na wynajem
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li onClick= {() => setShowMenu(false)}>
              <Link  
                to="/mieszkania/wynajem"
                className={`${navbarLinkBaseClass} border-t-[#6D6E6E]`}
              >
                WYNAJEM MIESZKAŃ
              </Link>
            </li>
            <li onClick= {() => setShowMenu(false)}
             
            >
              <Link
                to="/kontakt"
                className={`${navbarLinkBaseClass} border-t-[#E2E76F]`}
              >
                KONTAKT
              </Link>
            </li>

            {localStorage.getItem("token") !== null && (
              <>
                <li>
                  <Link to="/dodaj" className={`${navbarLinkBaseClass}`}>
                    Dodaj oferte
                  </Link>
                </li>
                <li>
                  <Link to="/login" className={`${navbarLinkBaseClass}`}>
                    Logowanie
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto">
        <ContactBar />
      </div>
    </nav>
  );
}

export default NavbarComponent;
