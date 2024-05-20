import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./adminhome.css";
import axios from "axios";
import Sidebar from "./sidebar.jsx";
import { Helmet } from "react-helmet";

function Inventory() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newInventoryItem, setNewInventoryItem] = useState({
    name: "",
    category: "",
    quantity: "",
    description: "",
  });
  const [editingItem, setEditingItem] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewInventoryItem({ ...newInventoryItem, [name]: value });
  };

  const handleAddAsset = async () => {
    try {
      if (
        !newInventoryItem.name ||
        !newInventoryItem.category ||
        !newInventoryItem.quantity ||
        !newInventoryItem.description
      ) {
        alert("All fields are required");
        return;
      }

      const response = await axios.post("http://localhost:3001/assets", {
        name: newInventoryItem.name,
        category: newInventoryItem.category,
        quantity: newInventoryItem.quantity,
        description: newInventoryItem.description,
      });

      setInventoryItems([...inventoryItems, response.data]);
      setNewInventoryItem({
        name: "",
        category: "",
        quantity: "",
        description: "",
      });
    } catch (error) {
      console.error("Error during asset creation:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewInventoryItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      description: item.description,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/assets/${editingItem._id}`,
        newInventoryItem
      );
      const updatedItems = inventoryItems.map((item) => {
        if (item._id === editingItem._id) {
          return response.data;
        }
        return item;
      });
      setInventoryItems(updatedItems);
      setEditingItem(null);
      setNewInventoryItem({
        name: "",
        category: "",
        quantity: "",
        description: "",
      });
    } catch (error) {
      console.error("Error during asset update:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
 
        await axios.delete(`http://localhost:3001/assets/${id}`);
        const updatedItems = inventoryItems.filter((item) => item._id !== id);
        setInventoryItems(updatedItems);
      
    } catch (error) {
      console.error("Error during asset deletion:", error);
    }
  };
  

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/assets");
        setInventoryItems(response.data);
      } catch (error) {
        console.error("Error while fetching assets:", error);
      }
    };
    fetchInventoryItems();
  }, []);

  return (
    <div className="adminhome-container">
      <Helmet>
        <title>Assert Pannel</title>
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
            <h1 className="adminhome-main-title"> Asset Admin Panel</h1>
            

            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newInventoryItem.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={newInventoryItem.category}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={newInventoryItem.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newInventoryItem.description}
                onChange={handleInputChange}
              />
            </div>
            {editingItem ? (
              <button onClick={handleUpdate}>Update Asset</button>
            ) : (
              <button onClick={handleAddAsset}>Add Asset</button>
            )}
            <h2>Asset List</h2>
            <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((asset, index) => (
                  <tr key={index}>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.quantity}</td>
                    <td>{asset.description}</td>
                    <td>
                      <button onClick={() => handleEdit(asset)}>Edit</button>
                      <button onClick={() => handleDelete(asset._id)}>
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

export default Inventory;
