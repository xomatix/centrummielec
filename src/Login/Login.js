import React, { useState } from "react";
import { Link } from "react-router-dom";
import { baseApiUrl } from "../Variables";

function IsTokenExpired() {
  var base64Url = localStorage.getItem("token").split(".")[1];
  if (base64Url === undefined) return true;
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  const tokenData = JSON.parse(jsonPayload);
  try {
    const decoded = tokenData;
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = decoded.exp;

    return currentTime >= expirationTime;
  } catch (error) {
    return true; // Error decoding the token
  }
}

export async function RefreshToken() {
  //check if token is expired
  if (localStorage.getItem("token") === null) return;

  if (IsTokenExpired()) {
    localStorage.removeItem("token");
    return;
  }

  const fullUrl = `${baseApiUrl}/login/refresh`;

  try {
    const token = localStorage.getItem("token");
    await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
    })
      .then((response) => {
        //console.log(`Bearer ${token}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data here
        //console.log('Response Data:', data);
        localStorage.setItem("token", data.token);
      })
      .catch((error) => {
        // Handle fetch errors here
        console.error("Fetch Error:", error.message);
      });
  } catch (error) {
    console.error("Error:", error);
  }
}

function Logout() {
  //console.log("Wylogowano");
  localStorage.removeItem("token");
  window.location = "/";
}

export function isLoggedIn() {}

function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: data.username,
      password: data.password,
    };

    //console.log(formData);

    const fullUrl = `${baseApiUrl}/login`;

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const requestData = await response.json();
      localStorage.setItem("token", requestData.token);
      setIsLoggedIn(true);
      window.location = "/";
    } catch (error) {
      console.error("Error:", error);
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="container mx-auto py-10" style={{ minHeight: "75vh" }}>
      <h2 className=" text-3xl flex flex-col items-center font-semibold mb-5">
        <div className="">Strona logowania</div>
        {localStorage.getItem("token") !== null && (
          <Link to="/">
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg mt-5"
              onClick={Logout}
            >
              Wyloguj
            </button>
          </Link>
        )}
      </h2>

      {localStorage.getItem("token") === null && (
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto bg-white p-5 rounded-lg shadow shadow-xl "
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Login:
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Login"
              type="text"
              id="username"
              name="username"
              value={data.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Hasło:
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Hasło"
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-center justify-between ">
            <button
              className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              type="submit"
            >
              Zaloguj
            </button>
          </div>

          {!isLoggedIn && (
            <div className="bg-red-500 text-white text-center rounded-lg p-2">
              Nie zalogowano!
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default Login;
