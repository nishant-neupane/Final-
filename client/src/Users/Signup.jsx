import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Please enter your name";
    }
    if (!email.trim()) {
      errors.email = "Please enter your email";
    }
    if (!password.trim()) {
      errors.password = "Please enter your password";
    }
    if (!confirmPassword.trim()) {
      errors.password = "Please enter your Conform password";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
      return;
    }
    checkEmailExists();
  };

  const checkEmailExists = () => {
    axios
      .post("http://localhost:3001/checkemail", { email })
      .then((response) => {
        const { exists } = response.data;
        if (exists) {
          toast.error("Email already exists");
        } else {
          requestOTP();
        }
      })
      .catch((error) => {
        toast.error("An error occurred while checking email existence");
      });
  };
  const requestOTP = () => {
    axios
      .post("http://localhost:3001/sendotp", { email })
      .then((response) => {
        setOtpSent(true);
        setSignupError("");
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response && error.response.data.error) {
          errorMessage = error.response.data.error;
          if (errorMessage !== "Email already exists") {
            setSignupError(errorMessage);
          }
        } else {
          errorMessage = "An error occurred while sending OTP";
          setSignupError(errorMessage);
        }
      });
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/verifyotp", { email, otp })
      .then((response) => {
        createUser();
      })
      .catch((error) => {
        setSignupError(
          error.response?.data?.error || "An error occurred during signup"
        );
      });
  };

  const createUser = async () => {
    try {
      await axios.post("http://localhost:3001/signup", {
        name,
        email,
        password,
      });
      setTimeout(() => navigate("/login"), 2000);
      toast.success("Signuup successful!");
    } catch (error) {
      setSignupError(
        error.response?.data?.error || "An error occurred during signup"
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-around align-items-center vh-100"
      style={{ backgroundColor: "#fff", height: "100vh", overflowY: "scroll" }}
    >
      <Helmet>
        <title>Signup Page</title>
      </Helmet>
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-white p-4 rounded"
        style={{ color: "#333", width: "40%" }}
      >
        <h2>Signup Page</h2>
        {!otpSent ? (
          <form
            onSubmit={handleSubmit}
            className="w-90 p-4 rounded border"
            style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-3">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              {errors.name && (
                <div className="alert alert-danger mt-2">{errors.name}</div>
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
              {errors.email && (
                <div className="alert alert-danger mt-2">{errors.email}</div>
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
              {errors.password && (
                <div className="alert alert-danger mt-2">{errors.password}</div>
              )}
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  name="password"
                  className="form-control rounded-0"
                  style={{ paddingRight: "3rem" }} 
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
                    onClick={togglePasswordVisibility}
                    style={{ height: "100%" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="confirmPassword">
                <strong>Confirm Password</strong>
              </label>
              {errors.confirmPassword && (
                <div className="alert alert-danger mt-2">
                  {errors.confirmPassword}
                </div>
              )}
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  name="confirmPassword"
                  className="form-control rounded-0"
                  style={{ paddingRight: "3rem" }} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ height: "100%" }}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-submit w-100 bg-primary rounded-pill btn-lg"
              style={{ color: "#fff" }}
            >
              Request OTP
            </button>
            {signupError && (
              <div className="alert alert-danger mt-2">{signupError}</div>
            )}
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="btn btn-default border w-100 bg-secondary rounded-pill text-decoration-none btn-lg"
                style={{ color: "#fff" }}
              >
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleOTPSubmit}
            className="w-90 p-4 rounded border"
            style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-3">
              <label htmlFor="otp">
                <strong>OTP</strong>
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                name="otp"
                autoComplete="off"
                className="form-control rounded-0"
                style={{ width: "100%" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-submit w-100 bg-primary rounded-pill btn-lg"
              style={{ color: "#fff" }}
            >
              Verify OTP
            </button>
            {signupError && (
              <div className="alert alert-danger mt-2">{signupError}</div>
            )}
          </form>
        )}
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

export default Signup;
