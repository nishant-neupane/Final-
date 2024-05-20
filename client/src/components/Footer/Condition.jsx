import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Condition = () => {
  return (
    <div
      style={{
        margin: "3% auto",
        maxWidth: "800px",
        padding: "20px",
        paddingRight: "10%",
      }}
    >
      <Helmet>
        <title>Privacy Policy & Terms of Service - Hotel Shivansh</title>
        <meta
          name="description"
          content="Privacy Policy and Terms of Service for Hotel Shivansh."
        />
      </Helmet>
      <div className="contact-container">
        <div className="content-condition">
          <h2>Privacy Policy</h2>
          <p>
            At Hotel Shivansh, we value the privacy of our users and visitors.
            This Privacy Policy outlines the types of personal information we
            collect, how it is used, and the measures we take to protect your
            information.
          </p>
          <h3>Information Collection and Use:</h3>
          <ul>
            <li>
              We may collect personal information such as your name, email
              address, phone number, and payment details when you make a
              reservation or use our services.
            </li>
            <li>
              Your information is used to process reservations, communicate with
              you, improve our services, and personalize your experience.
            </li>
            <li>
              We may also collect non-personal information such as browser type,
              operating system, and IP address for analytical purposes.
            </li>
          </ul>
          <h3>Data Security:</h3>
          <ul>
            <li>
              We implement security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or
              destruction.
            </li>
            <li>
              Your payment information is encrypted using secure socket layer
              technology (SSL) and stored securely.
            </li>
          </ul>

          <h2>Terms of Service</h2>
          <p>
            By using Hotel Shivansh's services, you agree to the following Terms
            of Service:
          </p>
          <h3>Reservation and Payment:</h3>
          <ul>
            <li>Reservations are subject to availability and confirmation.</li>
            <li>
              Payment is required at the time of booking, and cancellations may
              be subject to a fee.
            </li>
          </ul>
          <h3>Use of Services:</h3>
          <ul>
            <li>
              You agree to use our services for lawful purposes and comply with
              all applicable laws and regulations.
            </li>
            <li>
              You are responsible for any content you post or submit through our
              services.
            </li>
          </ul>
          <div
            className="floor"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <Link to="/home">
                <button className="primary-btn">I Agree</button>
              </Link>
            </div>
            <div>
              <Link to="/home" className="back-button">
                <button className="primary-btn">&lt; Back</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Condition;
