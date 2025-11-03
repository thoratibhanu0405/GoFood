import React from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();

  // ✅ Use backend URL from .env
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail || data.length === 0) {
      alert("Your cart is empty or you're not logged in!");
      return;
    }

    const payload = {
      order_data: [...data],
      email: userEmail,
      order_date: new Date().toDateString(),
    };

    console.log("Checkout Payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orderData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        dispatch({ type: "DROP" });
        alert("✅ Order placed successfully!");
      } else {
        const errorData = await response.json();
        console.error("Order failed:", errorData);
        alert(`Order failed: ${errorData.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("⚠️ Error placing order. Please try again later.");
    }
  };

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3">🛒 The Cart is Empty!</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
        <table className="table table-hover">
          <thead className="text-success fs-4">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Option</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>₹{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn p-0"
                    onClick={() => dispatch({ type: "REMOVE", index })}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <h1 className="fs-2">Total Price: ₹{totalPrice}/-</h1>
        </div>

        <div>
          <button className="btn bg-success mt-5 text-white" onClick={handleCheckOut}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
