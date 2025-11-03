import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // ✅ Environment-based backend URL
  const API_URL = process.env.REACT_APP_API_URL || "https://gofood-s274.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = credentials.email.trim();
    const password = credentials.password.trim();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/loginuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const json = await response.json();
      console.log("Login response:", json);

      if (json.success) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('authToken', json.authToken);
        navigate("/");
      } else {
        alert(json.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("❌ Login fetch failed:", error);
      alert("Unable to connect to the server. Please check your network or backend.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        height: '100vh',
        backgroundSize: 'cover'
      }}
    >
      <Navbar />
      <div className='container'>
        <form
          className='w-50 m-auto mt-5 border bg-dark border-success rounded'
          onSubmit={handleSubmit}
        >
          <div className="m-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name='email'
              value={credentials.email}
              onChange={onChange}
              aria-describedby="emailHelp"
              required
            />
            <div id="emailHelp" className="form-text text-light">
              We'll never share your email with anyone else.
            </div>
          </div>

          <div className="m-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name='password'
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="m-3 btn btn-success">Login</button>
          <Link to="/signup" className="m-3 mx-1 btn btn-danger">New User</Link>
        </form>
      </div>
    </div>
  );
}
