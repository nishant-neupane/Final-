import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminhome.css";
import Sidebar from "./sidebar.jsx";
import { Helmet } from "react-helmet";

function Employee() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({
    name: "",
    jobTitle: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/workers");
      setWorkers(response.data);
    } catch (error) {
      setError("Error fetching workers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewWorker({ ...newWorker, [name]: value });
    setValidationError({ ...validationError, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!newWorker.name) {
      errors.name = "Name is required";
    }
    if (!newWorker.jobTitle) {
      errors.jobTitle = "Job Title is required";
    }
    if (!newWorker.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newWorker.email)) {
      errors.email = "Email is invalid";
    }
    if (!newWorker.password) {
      errors.password = "Password is required";
    }
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddWorker = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/workers",
        newWorker
      );
      setWorkers([...workers, response.data]);
      setNewWorker({ name: "", jobTitle: "", email: "", password: "" });
    } catch (error) {
      setError("Error adding worker");
    }
  };

  const handleDeleteWorker = async (id) => {
    try {
      
    
        await axios.delete(`http://localhost:3001/workers/${id}`);
        setWorkers(workers.filter((worker) => worker._id !== id));
      
    } catch (error) {
      setError("Error deleting worker");
    }
  };

  return (
    <div className="adminhome-container">
      <Helmet>
        <title>Employee Panel</title>
      </Helmet>
      <div className="sidebar">
        <Sidebar
          openSidebarToggle={openSidebar}
          OpenSidebar={() => setOpenSidebar(!openSidebar)}
        />
      </div>
      <div className="main-content">
        <main className="adminhome-main-container">
          <div>
            <h2 className="adminhome-main-title"> Employee Admin Panel</h2>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newWorker.name}
                onChange={handleInputChange}
              />
              {validationError.name && (
                <div className="error-message">{validationError.name}</div>
              )}
            </div>
            <div>
              <label htmlFor="jobTitle">Job Title:</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={newWorker.jobTitle}
                onChange={handleInputChange}
              />
              {validationError.jobTitle && (
                <div className="error-message">{validationError.jobTitle}</div>
              )}
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newWorker.email}
                onChange={handleInputChange}
              />
              {validationError.email && (
                <div className="error-message">{validationError.email}</div>
              )}
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newWorker.password}
                onChange={handleInputChange}
              />
              {validationError.password && (
                <div className="error-message">{validationError.password}</div>
              )}
            </div>
            <button onClick={handleAddWorker}>Add Employee</button>
            {error && <div className="error-message">{error}</div>}
            <h2>Worker List</h2>
            <div className="table-container">
            {loading ? (
              <div>Loading...</div>
            ) : (
              
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id}>
                      <td>{worker._id}</td>
                      <td>{worker.name}</td>
                      <td>{worker.jobTitle}</td>
                      <td>{worker.email}</td>
                      <td>
                        <button onClick={() => handleDeleteWorker(worker._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Employee;
