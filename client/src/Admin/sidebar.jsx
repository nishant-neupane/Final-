import React from "react";
import { Link } from "react-router-dom";
import {
  MdInventory,
  MdOutlineBedroomChild,
  MdDashboard,
} from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { FaPeopleGroup } from "react-icons/fa6";
import "./adminhome.css";

function Sidebar({ openSidebarToggle }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/adminhome">
            <MdDashboard className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/booking">
            <TbBrandBooking className="icon" /> Booking
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/room">
            <MdOutlineBedroomChild className="icon" /> Room
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/inventory">
            <MdInventory className="icon" /> Assets
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/employee">
            <FaPeopleGroup className="icon" /> Employee
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
