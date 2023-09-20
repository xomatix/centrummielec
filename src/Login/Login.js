
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { baseApiUrl } from '../Variables';

function IsTokenExpired() {
    var base64Url = localStorage.getItem("token").split('.')[1];
    if (base64Url === undefined)
        return true;
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

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
    if (localStorage.getItem('token') === null)
        return;

    if (IsTokenExpired()) {
        localStorage.removeItem('token');
        return;
    }

    const fullUrl = `${baseApiUrl}/login/refresh`;

    try {
        const token = localStorage.getItem('token');
        await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': `Bearer ${token}`,
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
                localStorage.setItem('token', data.token);
            })
            .catch((error) => {
                // Handle fetch errors here
                console.error('Fetch Error:', error.message);
            });

    } catch (error) {
        console.error('Error:', error);
    }

}

function Logout() {
    //console.log("Wylogowano");
    localStorage.removeItem('token');
    window.location = '/';
}

export function isLoggedIn() {

}

function Login() {

    const [data, setData] = useState({
        username: '',
        password: '',
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const requestData = await response.json();
            localStorage.setItem('token', requestData.token);
            setIsLoggedIn(true);
            window.location = '/';
        } catch (error) {
            console.error('Error:', error);
            setIsLoggedIn(false);
        }

    }

    return (
        <div>
            <h2>Strona logowania {localStorage.getItem('token') !== null && <Link to='/'><button onClick={Logout}>Wyloguj</button></Link>}</h2>
            {localStorage.getItem('token') === null &&
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            placeholder="Login"
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            placeholder="Hasło"
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            }
            {!isLoggedIn && <p>Nie zalogowano!</p>}
        </div>
    )
}

export default Login