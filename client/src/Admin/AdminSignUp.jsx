import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
function AdminSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setSignupError("Please fill in the name field");
      return;
    }
    if (!email) {
      setSignupError("Please fill in the email field");
      return;
    }
    if (!password) {
      setSignupError("Please fill in the password field");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/admin/signup", {
        name,
        email,
        password,
      });

      
      setSignupSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
      toast.success("Admin Created successful!")
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setSignupError(err.response.data.error);
      } else {
        setSignupError("An error occurred during signup");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-around align-items-center vh-100"
      style={{ backgroundColor: "#fff", height: "100vh", overflowY: "scroll" }}
    >
      <Helmet>
        <title>Admin Signup Page</title>
      </Helmet>
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-white p-4 rounded"
        style={{ color: "#333", width: "40%" }}
      >
        <h2>Admin Signup Page</h2>
        <form
          onSubmit={handleSubmit}
          className="w-90 p-4 rounded border"
          style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            {signupError && !name && (
              <div className="alert alert-danger mt-2" role="alert">
                {signupError}
              </div>
            )}
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              autoComplete="off"
              className="form-control rounded-0"
              style={{ width: "100%" }}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            {signupError && !email && (
              <div className="alert alert-danger mt-2" role="alert">
                {signupError}
              </div>
            )}
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              autoComplete="off"
              className="form-control rounded-0"
              style={{ width: "100%" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                className="form-control rounded-0"
                style={{ width: "100%" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary border-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            {signupError && !password && (
              <div className="alert alert-danger mt-2" role="alert">
                {signupError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-submit w-100 bg-primary rounded-pill btn-lg"
            style={{ color: "#fff" }}
          >
            Register
          </button>
          {signupError && (
            <div className="alert alert-danger mt-2" role="alert">
              {signupError}
            </div>
          )}
          {signupSuccess && (
            <div className="alert alert-success mt-2" role="alert">
              Signup successful. Redirecting to login...
            </div>
          )}
          <p>
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="btn btn-default border w-100 bg-secondary rounded-pill text-decoration-none btn-lg"
              style={{ color: "#fff" }}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <img
        src="src/assets/vector.jpg"
        alt="image"
        className="img-fluid rounded"
        style={{ width: "60%", height: "auto" }}
      />
    </div>
  );
}

export default AdminSignup;
