import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingError, setBookingError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const localUserData = JSON.parse(localStorage.getItem("user"));
    if (localUserData) {
      setFormData({
        ...formData,
        fullName: localUserData.name,
        email: localUserData.email,
      });
    }
  }, []);

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [formData, roomDetails]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Please Login to Book Room");
      navigate("/");
    } else {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/room/${roomId}`);
      if (response.status === 200) {
        setRoomDetails(response.data);
        setFormData((prevData) => ({
          ...prevData,
          id: response.data._id,
        }));
      } else {
        console.error("Failed to fetch room details");
      }
    } catch (error) {
      console.error("Error occurred while fetching room details:", error);
    }
  };

  const calculateTotalAmount = () => {
    if (roomDetails && formData.checkInDate && formData.checkOutDate) {
      const checkInDate = new Date(formData.checkInDate);
      const checkOutDate = new Date(formData.checkOutDate);
      const numberOfNights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 3600 * 24)
      );
      const totalPrice = roomDetails.price * numberOfNights;
      setTotalAmount(totalPrice);
    } else {
      setTotalAmount(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      
      [name]: value,
    }));
  };
  

  const handleSubmit = async () => {
    try {
      // await axios.post("http://localhost:3001/send-booking-email", {
      //   bill: formData.id,
      //   fullName: formData.fullName,
      //   email: formData.email,
      //   phone: formData.phone,
      //   checkInDate: formData.checkInDate,
      //   checkOutDate: formData.checkOutDate,
      //   totalAmount,
      // });

      const bookingResponse = await axios.post(
        "http://localhost:3001/bookings",
        {
          id: formData.id,
          customerName: formData.fullName,
          customerEmail: formData.email,
          roomType: roomDetails.type,
          roomNumber: roomId,
          phoneNumber: formData.phone,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          adults: formData.adults,
          children: formData.children,
          totalAmount: totalAmount,
        }
      );

      setBookingError("");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        id: "",
      });

      navigate("/");
      // toast.success("Booking successful! Detail is sent to email");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error occurred while booking:", error.response.data);
        setBookingError(
          "An error occurred while booking. Please try again later."
        );
      } else {
        console.error("Error occurred while booking:", error);
        setBookingError(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  const handleKhaltiPayment = async () => {
    try {
      const requiredFields = [
        "fullName",
        "email",
        "phone",
        "checkInDate",
        "checkOutDate",
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setBookingError(`${field} is required`);
          setTimeout(() => {
            setBookingError(null);
          }, 4000);

          return;
        }
      }

      const checkInDate = new Date(formData.checkInDate);
      const checkOutDate = new Date(formData.checkOutDate);
      if (checkOutDate <= checkInDate) {
        setBookingError("Check-out date must be after check-in date");
        setTimeout(() => {
          setBookingError(null);
        }, 4000);
        return;
      }

      const today = new Date();
      if (checkInDate <= today) {
        setBookingError("Check-in date must be today or later");
        setTimeout(() => {
          setBookingError(null);
        }, 4000);
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/khalti/initiate-payment",
        {
          formData,
          totalAmount,
        }
      );
      if (response.status === 200) {
        await handleSubmit();
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          "Error occurred while initiating Khalti payment:",
          error.response.data
        );
        setBookingError(
          "An error occurred while booking. Please try again later."
        );
      } else {
        console.error("Error occurred while initiating Khalti payment:", error);
        setBookingError(
          "An unexpected error occurred. Please try again later."
        );
      }
      toast.error("Failed to initiate Khalti payment");
      setTimeout(() => {
        setBookingError(null);
      }, 4000);
    }
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  return (
    <div className="booking-form-container">
      <Helmet>
        <title>Booking Room</title>
      </Helmet>
      <h2>Room Booking</h2>
      <button className="close-button-book" onClick={() => navigate("/")}>
        Cancel
      </button>
      <form className="booking-form">
        <input
          className="booking-input"
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          className="booking-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="booking-input"
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          pattern="[0-9]*"
        />

        <div className="date-inputs">
          <div className="date-input">
            <label htmlFor="checkInDate">Check-in:</label>
            <input
              className="booking-input"
              type="date"
              name="checkInDate"
              id="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
            />
          </div>
          <div className="date-input">
            <label htmlFor="checkOutDate">Check-out:</label>
            <input
              className="booking-input"
              type="date"
              name="checkOutDate"
              id="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <label>
          Adults:
          <input
            className="booking-input"
            type="number"
            name="adults"
            min="1"
            value={formData.adults}
            onChange={handleChange}
          />
        </label>
        <label>
          Children:
          <input
            className="booking-input"
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleChange}
          />
        </label>
        <p>Total Amount: RS {totalAmount}</p>
        <button
          className="booking-button"
          type="button"
          onClick={handleKhaltiPayment}
        >
          Pay Now
        </button>
        {bookingError && <p className="error-message">{bookingError}</p>}
      </form>
    </div>
  );
}

export default BookingPage;
