import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import OurRooms from "../Rooms/OurRooms";

const ReadMore = () => {
  const [showRooms, setShowRooms] = useState(false);

  const toggleRooms = () => {
    setShowRooms((prevState) => !prevState);
  };

  return (
    <div>
      <Helmet>
        <title>Discover Our Hotel - Hotel Shivansh</title>
        <meta
          name="description"
          content="Learn more about Hotel Shivansh and its amenities and services."
        />
      </Helmet>
      <section className="read-more-container" style={{ marginTop: "20px" }}>
        <div className="read-more-content">
          <div className="header-cont-rm">
            <Link to="/" className="back-link-rm">
              <FaArrowLeft className="back-icon-rm" />
            </Link>
            <h1>Discover Our Hotel</h1>
          </div>
          <p>
            Hotel Shivansh is a luxurious retreat nestled amidst the stunning
            landscapes of Bhadrapur, Nepal. Our hotel offers a wide range of
            amenities and services to ensure a comfortable and memorable stay for
            our guests. From elegantly appointed rooms and suites to delicious
            dining options and top-notch recreational facilities, we strive to
            exceed your expectations at every turn.
          </p>
          <p>
            Whether you're visiting for business or leisure, Hotel Shivansh has
            everything you need for a relaxing and enjoyable stay. Explore our
            website to learn more about our accommodation options, dining venues,
            and special offers. We look forward to welcoming you to Hotel Shivansh
            and making your stay truly unforgettable.
          </p>
          <div className="cta-buttons-rm">
            <button className="primary-btn-rm" onClick={toggleRooms}>
              {showRooms ? "Unexplore Our Rooms" : "Explore Our Rooms"}
            </button>
           
          </div>
          {showRooms && (
            <div className="our-rooms-container">
              <OurRooms />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReadMore;
