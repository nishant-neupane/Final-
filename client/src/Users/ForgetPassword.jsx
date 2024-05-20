import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); 

  const handleSendVerification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/send-verification",
        { email }
      );
      setVerificationSent(true);
      setSuccessMessage(response.data.message);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleVerifyAndResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/verify-reset-password",
        { email, verificationCode, newPassword }
      );
      setSuccessMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response && error.response.data) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {verificationSent ? (
          <>
            <div className="form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleVerifyAndResetPassword}
            >
              Verify and Reset Password
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleSendVerification}>
            Send Verification Code
          </button>
        )}
      </div>
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
    </div>
  );
}

export default ForgotPassword;
