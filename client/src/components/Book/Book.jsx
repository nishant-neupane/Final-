import React, { useState, useEffect } from "react";
import "./Book.css";
import sampleImage from "../../style/img/showcase.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Book() {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    roomType: "Single",
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3001/available-rooms");
      if (response.status === 200) {
        const filteredRooms = response.data.filter(
          (room) => room.available && !room.isOccupied
        );
        setAvailableRooms(filteredRooms);
      } else {
        console.error("Failed to fetch available rooms");
      }
    } catch (error) {
      console.error("Error occurred while fetching available rooms:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoomClick = (roomId) => {
    navigate(`/bookingPage/${roomId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.checkInDate) {
      errors.checkInDate = "Please select an arrival date";
    }
    if (!formData.checkOutDate) {
      errors.checkOutDate = "Please select a departure date";
    }
    if (formData.adults <= 0) {
      errors.adults = "Number of adult cannot be negative";
    }
    if (formData.children < 0) {
      errors.children = "Number of children cannot be negative";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTimeout(() => {
        setFormErrors({});
      }, 3000);
      return;
    }

    const currentDate = new Date();
    const inDate = new Date(formData.checkInDate);
    const outDate = new Date(formData.checkOutDate);

    if (inDate < currentDate) {
      errors.checkInDate = "Check-in date must be today or in the future";
    }
    if (inDate >= outDate) {
      errors.checkOutDate = "Departure date must be after arrival date";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTimeout(() => {
        setFormErrors({});
      }, 3000);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/available-rooms?roomType=${formData.roomType}`
      );

      if (response.status === 200) {
        setAvailableRooms(response.data);
      } else {
        console.error("Failed to fetch available rooms");
      }
    } catch (error) {
      console.error("Error occurred while fetching available rooms:", error);
    }
  };

  return (
    <div className="hotel-booking-form">
      <h2>Hotel Room Booking Form</h2>
      <div className="container-rooms-book">
        <div className="form">
          <form className="grid" onSubmit={handleSubmit}>
            <div>
              <label>Check-in</label>
              <input
                type="date"
                name="checkInDate"
                placeholder="Arrival Date"
                value={formData.checkInDate}
                onChange={handleChange}
              />
              {formErrors.checkInDate && (
                <p className="error">{formErrors.checkInDate}</p>
              )}
            </div>
            <div>
              <label>Check-out</label>
              <input
                type="date"
                name="checkOutDate"
                placeholder="Departure Date"
                value={formData.checkOutDate}
                onChange={handleChange}
              />
              {formErrors.checkOutDate && (
                <p className="error">{formErrors.checkOutDate}</p>
              )}
            </div>
            <div>
              <label>Adults</label>
              <input
                type="number"
                name="adults"
                placeholder="Adults"
                value={formData.adults}
                onChange={handleChange}
              />
              {formErrors.adults && (
                <p className="error">{formErrors.adults}</p>
              )}
            </div>
            <div>
              <label>Childrens</label>
              <input
                type="number"
                name="children"
                placeholder="Children"
                value={formData.children}
                onChange={handleChange}
              />
              {formErrors.children && (
                <p className="error">{formErrors.children}</p>
              )}
            </div>
            <div>
              <label>Type</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
              </select>
            </div>
            <input type="submit" value="CHECK AVAILABILITY" />
          </form>
        </div>
      </div>
      <div className="booking-list">
        <div style={{ textAlign: "center" }}>
          <h3>Available Rooms</h3>
        </div>
        {availableRooms.length > 0 ? (
          <div className="room-list">
            {availableRooms.map((room) => (
              <div
                className="room"
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
              >
                <img src={sampleImage} alt="Room Sample" />
                <div className="room-info">
                  <h4>{room.type}</h4>
                  <p>Description: {room.description}</p>
                  <p>Price: {room.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No available rooms.</p>
        )}
      </div>
    </div>
  );
}

export default Book;
