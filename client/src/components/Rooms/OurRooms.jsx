import React, { useState, useEffect } from "react";
import "./OurRooms.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import image1 from "../../assets/image.jpg";
import image2 from "../../assets/image1.jpg";
import image3 from "../../assets/image2.jpg";
import image4 from "../../assets/image3.jpg";
import image5 from "../../assets/image4.jpg";
import image6 from "../../assets/image5.jpg";
import image7 from "../../assets/image6.jpg";
import image8 from "../../assets/image7.jpg";
import image9 from "../../assets/image8.jpg";
import image10 from "../../assets/image9.jpg";

function OurRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3001/rooms");
      if (response.status === 200) {
        setRooms(response.data);
      } else {
        console.error("Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBookNow = (roomId) => {
    navigate(`/bookingPage/${roomId}`);
  };

  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
  ];

  return (
    <section className="rooms">
      <div className="container top">
        <div className="heading">
          <h1>Explore</h1>
          <h2>Our Rooms</h2>
          <p>
            Discover our diverse range of comfortable and stylish accommodations
            tailored to your needs.
          </p>
        </div>

        <div className="content mtop">
          <div className="owl-carousel owl-carousel1 owl-theme">
            {rooms.map((room, index) => (
              <div className="items" key={index}>
                <div className="image">
                  <img
                    src={images[index % images.length]}
                    alt="Room Image"
                    width="200"
                    height="200"
                  />
                </div>
                <div className="text">
                  <h2>{room.type}</h2>
                  <p>{room.description}</p>
                  {room.available ? (
                    <div className="button flex">
                      <button
                        className="primary-btn"
                        onClick={() => handleBookNow(room.id)}
                      >
                        BOOK NOW
                      </button>
                      <h3>
                        Rs {room.price} <br />
                        <span>Per Night</span>
                      </h3>
                    </div>
                  ) : (
                    <p className="occupied" style={{ paddingBottom: "11px" }}>
                      Occupied
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurRooms;
