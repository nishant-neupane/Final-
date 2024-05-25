import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import About from "../components/About/About";
import Book from "../components/Book/Book";
import OurRooms from "../components/Rooms/OurRooms";
import Gallery from "../components/Gallery/Gallery";
import Features from "../components/Features/Features";
import Banner from "../components/Banner/Banner";
import Footer from "../components/Footer/Footer";
import Logo from "../../src/assets/logo.png";
import { toast } from "react-toastify";

import "./home.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.success("Logout successful!")
    }
  };

  return (
    <>
      <header
        className={`fixed-header ${menuOpen ? "active" : ""}`}
        
      >
        <div className="content flex_space">
          <div className="logo">
            <div
              style={{ position: "relative", width: "300px", height: "300px" }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ position: "absolute", top: "-35px", left: "10px" }}
              />
            </div>
          </div>
          <div className="navlinks">
            <ul id="menulist" style={{ maxHeight: menuOpen ? "100vh" : "0px" }}>
              <li onClick={() => scrollToSection(homeSectionRef)}>
                <Link to="#">Home</Link>
              </li>
              <li onClick={() => scrollToSection(aboutSectionRef)}>
                <Link to="#">About</Link>
              </li>
              <li onClick={() => scrollToSection(bookSectionRef)}>
                <Link to="#">Our Rooms</Link>
              </li>
              <li onClick={() => scrollToSection(gallerySectionRef)}>
                <Link to="#">Gallery</Link>
              </li>
              <li onClick={() => scrollToSection(servicesSectionRef)}>
                <Link to="#">Features</Link>
              </li>
              <li>
                <button
                  className="BL-btn"
                  onClick={() => scrollToSection(bookRoomSectionRef)}
                >
                  Book Now
                </button>
              </li>
              <li onClick={handleLogout}>
                <button className="BL-btn">Logout</button>
              </li>
            </ul>
            <span
              className={`fa ${menuOpen ? "fa-times" : "fa-bars"}`}
              onClick={toggleMenu}
            ></span>
          </div>
        </div>
      </header>
      <div>
        <Helmet>
          <title>Home - BSS Hotel</title>
        </Helmet>
        <div ref={homeSectionRef}></div>
        <div>
          <Banner />
        </div>
        <div ref={bookRoomSectionRef}>
          <Book />
        </div>
        <div ref={aboutSectionRef}>
          <About />
        </div>
        <div ref={bookSectionRef}>
          <OurRooms />
        </div>
        <div ref={gallerySectionRef}>
          <Gallery />
        </div>
        <div ref={servicesSectionRef}>
          <Features />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Header;
