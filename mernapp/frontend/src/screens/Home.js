import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/foodData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const json = await response.json();

      setFoodItem(Array.isArray(json[0]) ? json[0] : []);
      setFoodCat(Array.isArray(json[1]) ? json[1] : []);
    } catch (error) {
      console.error("❌ Failed to load food data:", error);
      setFoodItem([]);
      setFoodCat([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: '10' }}>
              <div className="d-flex justify-content-center">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="carousel-item active">
              <img src="https://cdn.pixabay.com/photo/2022/08/29/17/44/burger-7419420_1280.jpg" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://machsschoen.com/wp-content/uploads/2020/06/mini-burger-rezept.jpg" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://images8.alphacoders.com/369/369063.jpg" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className='container'>
          {foodCat.length > 0 &&
            foodCat.map((category) => (
              <div className='row mb-3' key={category._id || category.id}>
                <div className="fs-3 m-3">{category.CategoryName}</div>
                <hr />
                {foodItem.length > 0 ? (
                  foodItem
                    .filter(item =>
                      item.CategoryName === category.CategoryName &&
                      item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(filteredItem => (
                      <div key={filteredItem._id || filteredItem.id} className="col-12 col-md-6 col-lg-3">
                        <Card
                          foodItem={filteredItem}
                          options={filteredItem.options?.[0]}
                        />
                      </div>
                    ))
                ) : (
                  <div>No such data found</div>
                )}
              </div>
            ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}
