import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./adminhome.css";
import { Helmet } from "react-helmet";

function Room() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    roomNumber: "",
    type: "",
    description: "",
    price: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3001/rooms");
      if (response.status === 200) {
        setRooms(response.data);
      } else {
        setErrorMessage("Failed to fetch rooms");
      }
    } catch (error) {
      setErrorMessage("Error occurred while fetching rooms");
      console.error("Error occurred while fetching rooms:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveRoom = async () => {
    try {
      if (!formData.roomNumber || !formData.type || !formData.price) {
        setErrorMessage("All fields are required");
        return;
      }

      if (formData.type === "SELECT") {
        setErrorMessage("Please select a valid room type");
        return;
      }

      if (isNaN(formData.price) || formData.price <= 0) {
        setErrorMessage("Price must be a positive number");
        return;
      }

      if (formData.id) {
        await axios.put(`http://localhost:3001/rooms/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:3001/rooms", formData);
      }

      fetchRooms();
      resetFormData();
    } catch (error) {
      setErrorMessage("Error saving room: " + error.response.data.error);
      console.error("Error saving room:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      id: null,
      roomNumber: "",
      type: "",
      description: "",
      price: "",
    });
  };

  const handleEditRoom = (id) => {
    const roomToEdit = rooms.find((room) => room.id === id);
    setFormData({
      id: roomToEdit._id,
      roomNumber: roomToEdit.roomNumber,
      type: roomToEdit.type,
      description: roomToEdit.description,
      price: roomToEdit.price,
    });
  };

  const handleDeleteRoom = async (id) => {
    try {
     
        await axios.delete(`http://localhost:3001/rooms/${id}`);
        fetchRooms();
      
    } catch (error) {
      setErrorMessage("Error deleting room: " + error.response.data.error);
      console.error("Error deleting room:", error);
    }
  };
  

  return (
    <div className="adminhome-container">
      <Helmet>
        <title>Room Pannel</title>
      </Helmet>
      <div id="sidebar" className={openSidebar ? "sidebar open" : "sidebar"}>
        <Sidebar
          openSidebarToggle={openSidebar}
          OpenSidebar={() => setOpenSidebar(!openSidebar)}
        />
      </div>
      <div className="main-content">
        <main className="adminhome-main-container">
          <div>
            <h1 className="adminhome-main-title">Room Admin Panel</h1>
            <div>
              <label>Room Number:</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="SELECT">SELECT</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
              </select>
            </div>
            <div>
              <label>Description:</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleSaveRoom}>
              {formData.id ? "Update Room" : "Add Room"}
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <h2>Room List</h2>
            <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Room Number</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.roomNumber}</td>
                    <td>{room.type}</td>
                    <td>{room.description}</td>
                    <td>RS {room.price} </td>
                    <td>
                      <button onClick={() => handleEditRoom(room.id)}>
                        {" "}
                        Edit
                      </button>
                      <button onClick={() => handleDeleteRoom(room.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Room;
