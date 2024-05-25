import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setErrorMessage("");

    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in both email and password fields");
      return;
    }
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((response) => {
        const { user } = response.data;

        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
        toast.success("Login successful!")
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setErrorMessage("Incorrect Username or Password. Please try again.");

        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      });
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };

  const handleAdminLogin = () => {
    navigate("/adminHome");
  };

  return (
    <div
      style={{ backgroundColor: "#fff", height: "100vh", overflowY: "scroll" }}
    >
        <Helmet>
        <title>Login Page</title>
      </Helmet>
      <div className="position-relative">
        <div className="d-flex justify-content-between align-items-center py-4 px-5">
          <div></div>
          <div>
            <button
              onClick={handleAdminLogin}
              className="btn btn-admin-login bg-primary position-absolute top-0 end-0 m-1"
              style={{ color: "#fff", border: "none" }}
            >
              Admin Login
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-around align-items-center">
          <div
            className="d-flex flex-column justify-content-center align-items-center bg-white p-4 rounded"
            style={{
              color: "#333",
              width: "90%",
              maxWidth: "500px",
              margin: "auto",
            }}
          >
            <h2>Login Page</h2>
            <form
              onSubmit={handleSubmit}
              className="w-9 p-4 rounded border"
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
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
              </div>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-submit w-100 bg-primary rounded-pill btn-lg"
                style={{ color: "#fff" }}
              >
                Login
              </button>
              <p>
                <span
                  onClick={handleForgotPassword}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    textAlign: "right",
                  }}
                >
                  Forgot Password?
                </span>
              </p>
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
          <img
            src="src/assets/vector.jpg"
            alt="image"
            className="img-fluid rounded"
            style={{ width: "60%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
