import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ForgotPasswordAdmin() {
  const [email, setEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSendAdminVerification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/send-admin-verification",
        { email }
      );
      setVerificationSent(true);
      setSuccessMessage(response.data.message);

      showAlertWithTimeout("sent OTP successfully");

    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleVerifyAndResetAdminPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/verify-reset-admin-password",
        { email, verificationCode, newPassword }
      );
      setSuccessMessage(response.data.message);

      navigate("/admin");

      showAlertWithTimeout("Admin Password Changed successfully");

    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const showAlertWithTimeout = (message) => {
    alert(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handleErrorResponse = (error) => {
    if (error.response && error.response.data) {
      setErrorMessage(error.response.data.error);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Admin Forgot Password</h2>
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
              onClick={handleVerifyAndResetAdminPassword}
            >
              Verify and Reset Password
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleSendAdminVerification}>
            Send Verification Code
          </button>
        )}
      </div>
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
    </div>
  );
}

export default ForgotPasswordAdmin;
