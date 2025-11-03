import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
  const [orderData, setOrderData] = useState(null);

  // ✅ Automatically use environment backend or fallback
  const API_URL = process.env.REACT_APP_API_URL || "https://gofood-s274.onrender.com";

  const fetchMyOrder = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return alert("User not logged in.");

      const res = await fetch(`${API_URL}/api/myOrderData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      const response = await res.json();
      console.log("Fetched order data:", response);
      setOrderData(response);
    } catch (error) {
      console.error("❌ Failed to fetch order data:", error);
      alert("Unable to load your order history. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          {orderData && orderData.orderData ? (
            orderData.orderData.order_data
              .slice(0)
              .reverse()
              .map((orderGroup, idx) => (
                <div key={idx}>
                  {orderGroup.map((arrayData, i) => (
                    <div key={i}>
                      {arrayData.Order_date ? (
                        <div className="m-auto mt-5 text-center text-light fs-5">
                          <strong>{new Date(arrayData.Order_date).toLocaleString()}</strong>
                          <hr />
                        </div>
                      ) : (
                        <div className="col-12 col-md-6 col-lg-3 mb-3">
                          <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                            <div className="card-body">
                              <h5 className="card-title">{arrayData.name}</h5>
                              <div className="container w-100 p-0">
                                <span className="m-1">{arrayData.qty}</span>
                                <span className="m-1">{arrayData.size}</span>
                                <span className="m-1">
                                  ₹{arrayData.price}/-
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
          ) : (
            <div className="text-center mt-5 fs-4 text-light">
              {orderData === null
                ? "Loading your orders..."
                : "No previous orders found."}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
