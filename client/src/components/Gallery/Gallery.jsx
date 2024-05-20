import React from "react";
import "./Gallery.css";

import image1 from "../../assets/image.jpg";
import image2 from "../../assets/image1.jpg";
import image3 from "../../assets/image2.jpg";
import image4 from "../../assets/image3.jpg";
import image5 from "../../assets/image4.jpg";
import image6 from "../../assets/image5.jpg";
import image7 from "../../assets/image6.jpg";
import image8 from "../../assets/image7.jpg";
import image9 from "../../assets/image8.jpg";
import image10 from "../../assets/image9.jpg";

function Gallery() {
  return (
    <div className="container gallery-container">
      <div className="gallery">
        <div className="heading">
          <h1>Gallery</h1>
          <h2>Gallery</h2>
          <p>
            Explore our captivating gallery showcasing the charm and elegance of
            our hotel.
          </p>
        </div>
        <div className="gallery-row">
          <div className="row-md-4 mt-4">
            <img
              src={image1}
              alt="BSS Gallery Image 1"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image2}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image3}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image4}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image5}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image6}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image7}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image8}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image9}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image10}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
          <div className="row-md-4 mt-4">
            <img
              src={image2}
              alt="BSS Gallery Image 2"
              className="gallery__image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
