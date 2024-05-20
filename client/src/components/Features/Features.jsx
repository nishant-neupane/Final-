import React from "react";
import "./Features.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "../Features/delivery.jpg";

function Features() {
  return (
    <section className="services top">
      <div className="container">
        <div className="heading">
          <h1>SERVICES</h1>
          <h2>Our Services</h2>
          <p>
            Experience unparalleled hospitality with our array of exceptional
            amenities and services.
          </p>
        </div>

        <div className="content flex_space">
          <div className="left grid2">
            <div className="box">
              <div className="text">
                <i className="fas fa-pizza-slice"></i>
                <h3>Delicious Food</h3>
              </div>
            </div>
            <div className="box">
              <div className="text">
                <i className="fas fa-glass-cheers"></i>
                <h3>Party Palace</h3>
              </div>
            </div>
            <div className="box">
              <div className="text">
                <i className="fas fa-utensils"></i>
                <h3>In-house Restaurant</h3>
              </div>
            </div>
            <div className="box">
              <div className="text">
                <i className="fas fa-horse"></i>
                <h3>Horse Riding</h3>
              </div>
            </div>
          </div>
          <div className="right">
            <img src={Image} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
