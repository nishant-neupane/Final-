import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./About.css";
import AboutImage from "../About/About.jpg";

function About() {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate("/Menu");
  };

  return (
    <div>
      <Helmet>
        <title>Hotel Shivansh</title>
        <meta
          name="description"
          content="Learn more about Hotel Shivansh in Bhadrapur, Nepal."
        />
      </Helmet>
      <div className="container flex">
        <div className="left">
          <div className="heading">
            <h1
              className="head"
              style={{
                fontSize: "90px",
                fontWeight: 500,
                opacity: 0,
                fontFamily: "serif",
                position: "absolute",
                top: "147%",
              }}
            >
              WELCOME
            </h1>

            <h2>Hotel Shivansh</h2>
          </div>
          <p>
            Hotel Shivansh is a luxurious retreat nestled amidst the stunning
            landscapes of Bhadrapur, Nepal. Our hotel offers a wide range of
            amenities and services to ensure a comfortable and memorable stay
            for our guests. From elegantly appointed rooms and suites to
            delicious dining options and top-notch recreational facilities, we
            strive to exceed your expectations at every turn.
          </p>
          <button className="primary-btn" onClick={handleAboutClick}>
            Menu
          </button>
        </div>
        <div className="right">
          <img src={AboutImage} alt="" width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
}

export default About;
