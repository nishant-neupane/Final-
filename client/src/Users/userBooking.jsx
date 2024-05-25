import React, { useState } from "react";

function userBooking() {
  const [roomType, setRoomType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [error, setError] = useState("");

  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  const handleCheckInDateChange = (event) => {
    setCheckInDate(event.target.value);
  };

  const handleCheckOutDateChange = (event) => {
    setCheckOutDate(event.target.value);
  };

  const handleNumberOfGuestsChange = (event) => {
    setNumberOfGuests(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!roomType || !checkInDate || !checkOutDate || !numberOfGuests) {
      setError("Please fill in all the fields");
      return;
    }



    setError("");
  };

  return (
    <div>
      <h1>Booking Management</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roomType">Room Type:</label>
          <select
            id="roomType"
            value={roomType}
            onChange={handleRoomTypeChange}
          >
            <option value="">Select Room Type</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>
        <div>
          <label htmlFor="checkInDate">Check-in Date:</label>
          <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={handleCheckInDateChange}
          />
        </div>
        <div>
          <label htmlFor="checkOutDate">Check-out Date:</label>
          <input
            type="date"
            id="checkOutDate"
            value={checkOutDate}
            onChange={handleCheckOutDateChange}
          />
        </div>
        <div>
          <label htmlFor="numberOfGuests">Number of Guests:</label>
          <input
            type="number"
            id="numberOfGuests"
            value={numberOfGuests}
            onChange={handleNumberOfGuestsChange}
          />
        </div>
        <button type="submit">Book Now</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default userBooking;
