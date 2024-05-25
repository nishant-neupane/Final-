import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in both email and password fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    axios
      .post("http://localhost:3001/admin/login", { email, password })
      .then((response) => {
        const { admin } = response.data;
        localStorage.setItem("adminuser", JSON.stringify(admin));
        navigate("/adminhome");
        toast.success("Admin Login successful!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Incorrect Username or Password. Please try again.");
      });
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const handleUserLogin = () => {
    navigate("/login");
  };

  //   const handlePasswordChangeSuccess = () => {
  //     setPasswordChanged(true);
  //     setTimeout(() => {
  //       setPasswordChanged(false);
  //     }, 3000);
  //   };

  return (
    <div className="position-relative">
      <Helmet>
        <title>Admin Login Page</title>
      </Helmet>
      <button
        onClick={handleUserLogin}
        className="btn btn-admin-login bg-primary position-absolute top-0 end-0 m-4"
        style={{ color: "#fff", border: "none" }}
      >
        User Login
      </button>
      <div className="d-flex justify-content-around align-items-center vh-100">
        <div
          className="d-flex flex-column justify-content-center align-items-center bg-white p-4 rounded"
          style={{ color: "#333", width: "40%" }}
        >
          <h2>Admin Login Page</h2>
          <form
            onSubmit={handleSubmit}
            className="w-90 p-4 rounded border"
            style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
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
            <div className="mb-3">
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
                  onChange={(e) => setPassword(e.target.value)}
                  value={password} 
                />
                <div
                  className="input-group-append"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1,
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ height: "100%" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
            </div>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            {passwordChanged && (
              <div className="alert alert-success" role="alert">
                Password changed successfully!
              </div>
            )}
            <p>
              <Link
                to="/ForgotPasswordAdmin"
                style={{ color: "red" }}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Link>
            </p>
            <button
              type="submit"
              className="btn btn-submit w-100 bg-primary rounded-pill btn-lg"
              style={{ color: "#fff" }}
            >
              Login
            </button>

            <p>
              Create an Account{" "}
              <Link
                to="/signup"
                className="btn btn-default border w-100 bg-secondary rounded-pill text-decoration-none btn-lg"
                style={{ color: "#fff" }}
              >
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
