import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image1 from "../Banner/image1.jpg";
import Image2 from "../Banner/image2.jpg";
import Image3 from "../Banner/image3.jpg";

const Banner = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <section className="home">
      <div className="content">
        <Slider {...settings}>
          {[Image1, Image2, Image3].map((image, index) => (
            <div className="item" key={index}>
              <img src={image} alt="" style={{ width: "100%" }} />
            </div>
          ))}
        </Slider>
        <div className="text">
          <h1>Spend Your Holiday</h1>
          <p>
            Enjoy the tranquility of our resort nestled amidst breathtaking
            scenery.
          </p>
          <div className="flex">
            <Link className="primary-btn" to="/ReadMore">
              READ MORE
            </Link>
            <span style={{ margin: "0 10px" }}></span>
            <Link className="secondary-btn" to="/Contact">
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
