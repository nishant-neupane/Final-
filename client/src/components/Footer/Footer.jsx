import React, { useState, useRef, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Footer() {
  const [feedback, setFeedback] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const aboutSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to submit feedback.")
      setFeedback("");
      
      return;
    }
    try {
      await axios.post("http://localhost:3001/sendfeedback", { feedback });


      setFeedback("");
      toast.success("Feedback submitted successfully!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again later.");
    }
  };


  return (
    <div>
      <section className="newsletter mtop">
        <div className="container flex_space">
          <h1>Send Feedback</h1>

          <form onSubmit={handleSubmit}>
            <div className="submit">
              <input
                type="text"
                placeholder="Your Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <button className="primary-btn-submit" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
      <footer>
        <div className="container grid">
          <div className="box">
            <img src="images/logo-2.png" alt="" />
            <p>
              Hotel Shivansh is a luxurious retreat nestled amidst the stunning
              landscapes of Bhadrapur, Nepal. Our hotel offers a wide range of
              amenities and services to ensure a comfortable and memorable stay
              for our guests. From elegantly appointed rooms and suites to
              delicious dining options and top-notch recreational facilities, we
              strive to exceed your expectations at every turn.
            </p>

            <div className="icon">
              <a
                href="https://www.facebook.com/hotelshivanshbhadrapur"
                target="_blank"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.instagram.com/hotel_shivansh_garden/"
                target="_blank"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://wa.me/9779852624333"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>{" "}
              </a>
              <a
                href="https://www.youtube.com/@HotelShivanshGarden"
                target="_blank"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="box">
            <h2>Links</h2>
            <ul>
              <li>
                <a
                  href="/Contact"
                  style={{ color: "inherit", textDecoration: "none" }}
                  onClick={() => scrollToSection(contactSectionRef)}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/ReadMore"
                  style={{ color: "inherit", textDecoration: "none" }}
                  onClick={() => scrollToSection(aboutSectionRef)}
                >
                  Read More
                </a>
              </li>
              <li>
                <a
                  href="/Condition"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="box">
            <h2>Contact Us</h2>
            <div>
              <i className="fa fa-location-dot"></i>
              <a
                href="https://www.google.com/maps?q=26.5744909,88.0606197"
                target="_blank"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Kendramode, Bhadrapur, Nepal
              </a>
            </div>

            <div>
              <i className="fa fa-phone"></i>
              <a
                href="tel:+977023452478"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                +977 023-452478
              </a>
            </div>

            <div>
              <i className="fa fa-envelope"></i>
              <a
                href="mailto:shivanshotel@gmail.com"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Shivanshotel@gmail.com
              </a>
            </div>
          </div>
        </div>
      
      </footer>
    </div>
  );
}

export default Footer;
