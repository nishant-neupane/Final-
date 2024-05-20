import React from "react";
import { Link } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import "./adminhome.css";

function Header() {
  return (
    <header className="header">
      <div ><h2>Admin Panel</h2></div>
      <div className="header-right">
            <Link to="/profile">
              <BsPersonCircle className="icon" />
            </Link>
  
      </div>
    </header>
  );
}

export default Header;
