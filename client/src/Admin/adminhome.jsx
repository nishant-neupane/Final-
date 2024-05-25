import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar.jsx";
import { Helmet } from "react-helmet";
import { FaBars } from "react-icons/fa";
import "./adminhome.css";

function Adminhome() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalRoomsUsed, setTotalRoomsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsResponse, employeesResponse, assetsResponse] =
        await Promise.all([
          axios.get("http://localhost:3001/rooms"),
          axios.get("http://localhost:3001/employees"),
          axios.get("http://localhost:3001/assets"),
        ]);

      const rooms = roomsResponse.data;
      if (!Array.isArray(rooms))
        throw new Error("Invalid data format for rooms");
      setTotalRooms(rooms.length);
      setAvailableRooms(rooms.filter((room) => room.available).length);
      setTotalRoomsUsed(rooms.filter((room) => room.isOccupied).length);

      const employees = employeesResponse.data;
      if (!Array.isArray(employees))
        throw new Error("Invalid data format for employees");
      setTotalEmployees(employees.length);

      const assets = assetsResponse.data;
      if (!Array.isArray(assets))
        throw new Error("Invalid data format for assets");
      setTotalAssets(assets.length);

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="adminhome-container">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="adminhome-header">
        <button
          className="hamburger"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <FaBars />
        </button>
      </div>
      <div className={`adminhome-sidebar ${openSidebar ? "open" : ""}`}>
        <Sidebar openSidebarToggle={openSidebar} />
      </div>
      <div className="adminhome-main-content">
        <main className="adminhome-main-container">
          <div className="adminhome-main-title">
            <h1>DASHBOARD</h1>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div className="adminhome-main-cards">
              <div className="adminhome-card">
                <h4>Total Rooms</h4>
                <p>{totalRooms}</p>
              </div>
              <div className="adminhome-card">
                <h4>Total Rooms Used</h4>
                <p>{totalRoomsUsed}</p>
              </div>
              <div className="adminhome-card">
                <h4>Total Rooms Available</h4>
                <p>{availableRooms}</p>
              </div>
              <div className="adminhome-card">
                <h4>Total Employees</h4>
                <p>{totalEmployees}</p>
              </div>
              <div className="adminhome-card">
                <h4>Total Assets Available</h4>
                <p>{totalAssets}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Adminhome;
