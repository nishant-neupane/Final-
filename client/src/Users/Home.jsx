import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import About from "../components/About/About";
import Book from "../components/Book/Book";
import OurRooms from "../components/Rooms/OurRooms";
import Gallery from "../components/Gallery/Gallery";
import Features from "../components/Features/Features";
import Banner from "../components/Banner/Banner";
import Footer from "../components/Footer/Footer";
import Logo from "../../src/assets/logo.svg";

import "./home.css";
import { toast } from "react-toastify";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const aboutSectionRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const homeSectionRef = useRef(null);
  const bookSectionRef = useRef(null);
  const bookRoomSectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (ref = 0) => {
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: "smooth",
      });
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
      toast.success("Logout Succesfully!");
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed-header ${menuOpen ? "open" : ""}`}
      >
        <div className="content flex_space">
          <div className="logo">
            <div
              style={{ position: "relative", width: "300px", height: "300px" }}
            >
              {/* <ul className="logo">
                <li className="logo" onClick={() => scrollToSection(homeSectionRef)}>
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ position: "absolute", top: "-35px", left: "10px", cursor: "pointer" }}
                  />
                </li>
              </ul> */}
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
              {isLoggedIn ? (
                <>
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
                </>
              ) : (
                <>
                  <li>
                    <Link className="primary-btn" to="/login">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link className="primary-btn" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <span
              className={`fa ${menuOpen ? "fa-times" : "fa-bars"}`}
              onClick={() => setMenuOpen(!menuOpen)}
            ></span>
          </div>
        </div>
      </header>
      <div style={{ opacity: menuOpen ? 0.4 : 1 }}>
        <Helmet>
          <title>Home - BSS Hotel</title>
        </Helmet>
        <div ref={homeSectionRef}></div>
        <div>
          <Banner />
        </div>
        <div ref={bookRoomSectionRef} id="book-no">
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
