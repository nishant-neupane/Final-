import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar.jsx";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./adminhome.css";
import { Helmet } from "react-helmet";

function Booking() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    roomType: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
  });

  useEffect(() => {
    checkOverdueBookings();
    const intervalId = setInterval(checkOverdueBookings, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const checkOverdueBookings = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdueBookings = bookings.filter((booking) => {
        const checkOutDate = new Date(booking.checkOutDate);
        return checkOutDate <= today;
      });

      for (const booking of overdueBookings) {
        await handleDeleteBooking(booking.id);
      }
    } catch (error) {
      console.error("Error occurred while checking overdue bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:3001/bookings");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const filteredBookings = data.filter(
          (booking) => booking.paymentToken === true
        );

        console.log(filteredBookings);

        setBookings(filteredBookings);
      } else {
        console.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error occurred while fetching bookings:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "roomType" && value === "") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: "Single",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSaveBooking = async () => {
    try {
      setErrorMessage("");

      if (
        !formData.customerName.trim() ||
        !formData.customerEmail.trim() ||
        !formData.checkInDate ||
        !formData.checkOutDate ||
        formData.adults === 0
      ) {
        setErrorMessage("All fields are required");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        setErrorMessage("Please enter a valid email address");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        return;
      }

      const checkInDate = new Date(formData.checkInDate);
      const checkOutDate = new Date(formData.checkOutDate);
      if (checkOutDate <= checkInDate) {
        setErrorMessage("Check-out date must be after check-in date");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        setErrorMessage("Check-in date must be today or in the future");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        return;
      }

      const isRoomAlreadyBooked = bookings.some((booking) => {
        if (formData.id && booking.id === formData.id) {
          return false;
        }
        const bookingCheckInDate = new Date(booking.checkInDate);
        const bookingCheckOutDate = new Date(booking.checkOutDate);
        return (
          formData.roomNumber === booking.roomNumber &&
          ((checkInDate >= bookingCheckInDate &&
            checkInDate < bookingCheckOutDate) ||
            (checkOutDate > bookingCheckInDate &&
              checkOutDate <= bookingCheckOutDate))
        );
      });

      if (isRoomAlreadyBooked) {
        setErrorMessage("This room is already booked for the specified dates");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        return;
      }

      let url = "http://localhost:3001/bookings";
      let method = "POST";

      if (formData.id) {
        url += `/${formData.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await axios.patch(`http://localhost:3001/room/${formData.roomNumber}`, {
          available: false,
          isOccupied: true,
        });

        fetchBookings();
        setFormData({
          customerName: "",
          customerEmail: "",
          roomType: "Single",
          roomNumber: "",
          checkInDate: "",
          checkOutDate: "",
          adults: 1,
          children: 0,
        });
      } else {
        setErrorMessage("Failed to save booking");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      setErrorMessage("Error occurred while saving booking");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleEditBooking = (id) => {
    const bookingToEdit = bookings.find((booking) => booking.id === id);
    setFormData({
      id: id,
      customerName: bookingToEdit.customerName,
      customerEmail: bookingToEdit.customerEmail,
      roomType: bookingToEdit.roomType,
      roomNumber: bookingToEdit.roomNumber,
      checkInDate: formatDate(bookingToEdit.checkInDate),
      checkOutDate: formatDate(bookingToEdit.checkOutDate),
      adults: bookingToEdit.adults,
      children: bookingToEdit.children,
    });
  };

  const handleDeleteBooking = async (id) => {
    try {
      const bookingToDelete = bookings.find((booking) => booking.id === id);

      const response = await fetch(`http://localhost:3001/bookings/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await axios.patch(
          `http://localhost:3001/room/${bookingToDelete.roomNumber}`,
          {
            available: true,
            isOccupied: false,
          }
        );
        fetchBookings();
      } else {
        const errorMessage = await response.text();
        console.error("Failed to delete booking:", errorMessage);
      }
    } catch (error) {
      console.error("Error occurred while deleting booking:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="adminhome-container">
      <Helmet>
        <title>Booking Pannel</title>
      </Helmet>
      <div className="sidebar">
        <Sidebar
          openSidebarToggle={openSidebar}
          OpenSidebar={() => setOpenSidebar(!openSidebar)}
        />
      </div>
      <div className="main-content">
        <main className="adminhome-main-container">
          <div>
            <h1 className="adminhome-main-title">Booking Admin Panel</h1>
            <div>
              <label>Customer Name:</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Customer Email:</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Room Number:</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Room Type:</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Single Double Deluxe">
                  Single Double Deluxe
                </option>
              </select>
            </div>

            <div>
              <label>Check-In Date:</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Check-Out Date:</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Adults:</label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Children:</label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleSaveBooking}>
              {formData.id ? "Update Booking" : "Add Booking"}
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <h2>Booking List</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Room Type</th>
                    <th>Room Number</th>
                    <th>Check-In Date</th>
                    <th>Check-Out Date</th>
                    <th>Adults</th>
                    <th>Children</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.customerEmail}</td>
                      <td>{booking.roomType}</td>
                      <td>{booking.roomNumber}</td>
                      <td>{formatDate(booking.checkInDate)}</td>
                      <td>{formatDate(booking.checkOutDate)}</td>
                      <td>{booking.adults}</td>
                      <td>{booking.children} </td>
                      <td>
                        <button onClick={() => handleEditBooking(booking.id)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBooking(booking.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Booking;
