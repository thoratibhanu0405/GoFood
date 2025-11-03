import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: ""
  });

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const navLocation = () =>
      new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });

    try {
      const res = await navLocation();
      const lat = res.coords.latitude;
      const long = res.coords.longitude;

      // ✅ Updated API URL to Render backend
      const response = await fetch("https://gofood-s274.onrender.com/api/auth/getlocation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latlong: { lat, long } })
      });

      const { location } = await response.json();
      setCredentials(prev => ({ ...prev, location }));
    } catch (error) {
      console.error("Location fetch failed:", error);
      alert("Unable to fetch location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Updated API URL to Render backend
    const response = await fetch("https://gofood-s274.onrender.com/api/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem('token', json.authToken);
      navigate("/login");
    } else {
      alert("Enter valid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
      backgroundSize: 'cover',
      height: '100vh'
    }}>
      <Navbar />
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} required />
          </div>
          <div className="m-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} required />
          </div>
          <div className="m-3">
            <label htmlFor="location" className="form-label">Address</label>
            <input type="text" className="form-control" name='location' value={credentials.location} onChange={onChange} required />
          </div>
          {/* <div className="m-3">
            <button type="button" onClick={handleClick} className="btn btn-success">Use Current Location</button>
          </div> */}
          <div className="m-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} required />
          </div>
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
        </form>
      </div>
    </div>
  );
}
