import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/send-feedback", formData);
      // console.log("Feedback submitted successfully:", formData);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Contact Us - Hotel Shivansh</title>
        <meta
          name="description"
          content="Contact page for Hotel Shivansh in Bhadrapur, Nepal."
        />
      </Helmet>
      <div className="contact-container">
        <div className="header-cont">
          <Link to="/" className="back-link">
            <FaArrowLeft className="back-icon-cont" />
          </Link>
          <h1>Contact Us</h1>
        </div>
        <p>If you have any questions or inquiries, feel free to contact us:</p>
        <ul>
          <li>Email: Shivanshotel@gmail.com</li>
          <li>Phone: +977 023-452478</li>
          <li>Address: Kendramode, Bhadrapur, Nepal</li>
        </ul>
        <p>Alternatively, you can fill out the form below:</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
