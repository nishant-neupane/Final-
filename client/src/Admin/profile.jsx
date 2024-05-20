import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./profile.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaLock,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
  FaArrowLeft,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [dobError, setDobError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("adminuser"));
    setUser(userData);
    setEditedUser(userData);
  }, []);

  useEffect(() => {
    let errorTimeout;
    if (addressError || dobError || passwordError) {
      errorTimeout = setTimeout(() => {
        setAddressError(null);
        setDobError(null);
        setPasswordError(null);
      }, 5000);
    }

    return () => clearTimeout(errorTimeout);
  }, [addressError, dobError, passwordError]);

  useEffect(() => {
    if (editedUser) {
      localStorage.setItem("adminuser", JSON.stringify(editedUser));
    }
  }, [editedUser]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      toast.success("Logout successful!");
      localStorage.removeItem("adminuser");
      window.location.href = "/admin";
    }
  };

  const handleSaveProfile = async () => {
    if (!editedUser.address) {
      setAddressError("Please fill in the address field.");
      return;
    } else {
      setAddressError(null);
    }

    if (!editedUser.dateOfBirth) {
      setDobError("Please fill in the date of birth field.");
      return;
    } else {
      const dob = new Date(editedUser.dateOfBirth);
      const ageDifferenceMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDifferenceMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if (age < 18) {
        setDobError("You must be at least 18 years old.");
        return;
      } else {
        setDobError(null);
      }
    }

    if (currentPassword && newPassword && confirmNewPassword) {
      handlePasswordChange();
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:3001/admin/${user.email}`, editedUser);

      toast.success("Edited successful!");
      setEditMode(false);
    } catch (error) {
      toast.error("Error updating profile. Please try again later.");
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  const handleEditProfile = () => {
    setEditMode(!editMode);
    if (!editMode) {
      const clonedUser = { ...user };
      if (clonedUser.dateOfBirth) {
        const dob = new Date(clonedUser.dateOfBirth);
        const formattedDob = dob.toISOString().split("T")[0];
        clonedUser.dateOfBirth = formattedDob;
      }
      setEditedUser(clonedUser);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "dateOfBirth") {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      formattedValue = formattedDate;
    }

    const updatedUser = { ...editedUser, [name]: formattedValue };

    setEditedUser(updatedUser);
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    } else {
      setPasswordError(null);
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm new password must match.");
      return;
    } else {
      setPasswordError(null);
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from the current password."
      );
      return;
    } else {
      setPasswordError(null);
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3001/admin/change-password/${user.email}`,
        {
          currentPassword,
          newPassword,
        }
      );
      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordChangeSuccess(true);
    } catch (error) {
      toast.error("Error changing password. Please try again later.");
      console.error("Error changing password:", error);
    }
    setLoading(false);
  };

  return (
    <>
    <div>
      <Link to="/adminhome" className="back-link-profile" >
            <FaArrowLeft className="back-icon-profile" />
          </Link>
    </div>
    <div className="profile-container">
      <Helmet>
        <title>Profile Page</title>
      </Helmet>
      
      <div className="profile-header">
      
        <div className="profile-header-content">
          
          <div>
            <FaUserCircle
              className="profile-avatar "
              style={{ color: "white" }}
            />
            <h2 className="profile-name">{user?.name}</h2>
          </div>
        </div>
        <button className="profile-edit-btn" onClick={handleEditProfile}>
          <FaEdit className="edit-icon" />{" "}
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>
      <div className="profile-details">
        <h3 className="profile-section-title">Personal Information</h3>
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="info-label">
              <FaEnvelope className="info-icon" size={18} />
              <p className="info-text">Email:</p>
            </div>
            <div>
              <p className="info-value">{user?.email}</p>
            </div>
          </div>
          <div className="profile-info-item">
            <div className="info-label">
              <FaMapMarkerAlt className="info-icon" size={18} />
              <p className="info-text">Address:</p>
            </div>
            {editMode ? (
              <input
                type="text"
                name="address"
                value={editedUser?.address || ""}
                onChange={handleInputChange}
                className="info-input"
              />
            ) : (
              <div>
                <p className="info-value">{user?.address}</p>
              </div>
            )}
            {addressError && <p className="error-text">{addressError}</p>}
          </div>
          <div className="profile-info-item">
            <div className="info-label">
              <FaBirthdayCake className="info-icon" size={18} />
              <p className="info-text">Date of Birth:</p>
            </div>
            {editMode ? (
              <input
                type="date"
                name="dateOfBirth"
                value={editMode ? editedUser?.dateOfBirth || "" : ""}
                onChange={handleInputChange}
                className="info-input"
              />
            ) : (
              <div>
                <p className="info-value">
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("en-CA")
                    : ""}
                </p>
              </div>
            )}
            {dobError && <p className="error-text">{dobError}</p>}
          </div>

          <div className="profile-info-item">
            <div className="info-label">
              <FaLock className="info-icon" size={18} />
              <p className="info-text">Change Password:</p>
            </div>

            {editMode ? (
              <>
                <div className="password-input-container">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="info-input"
                  />
                  <button
                    className="eye-button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="info-input"
                  />
                  <button
                    className="eye-button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="password-input-container">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="info-input"
                  />
                  <button
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  >
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && <p className="error-text">{passwordError}</p>}
              </>
            ) : (
              <div>
                <p className="info-value">**********</p>
              </div>
            )}
          </div>
        </div>
        <div className="below">
          <button className="primary-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>

          <button className="primary-btn" onClick={handleSaveProfile}>
            Save
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import image from "../../src/assets/Background.jpg";
// import "./profile.css";
// import { Helmet } from "react-helmet";
// import { toast } from "react-toastify";
// import {
//   FaEdit,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaBirthdayCake,
//   FaLock,
//   FaSignOutAlt,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editedUser, setEditedUser] = useState(null);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [addressError, setAddressError] = useState(null);
//   const [dobError, setDobError] = useState(null);
//   const [passwordError, setPasswordError] = useState(null);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("adminuser"));
//     setUser(userData);
//     setEditedUser(userData);
//     fetchProfilePicture(userData.profilePicture);

//   }, []);

//   useEffect(() => {
//     let errorTimeout;
//     if (addressError || dobError || passwordError) {
//       errorTimeout = setTimeout(() => {
//         setAddressError(null);
//         setDobError(null);
//         setPasswordError(null);
//       }, 5000);
//     }

//     return () => clearTimeout(errorTimeout);
//   }, [addressError, dobError, passwordError]);

//   useEffect(() => {
//     if (editedUser) {
//       localStorage.setItem("adminuser", JSON.stringify(editedUser));
//     }
//   }, [editedUser]);

//   const handleLogout = () => {
//     const confirmed = window.confirm("Are you sure you want to logout?");
//     if (confirmed) {
//       toast.success("Logout successful!");
//       localStorage.removeItem("adminuser");
//       window.location.href = "/admin";
//     }
//   };

//   const handleSaveProfile = async () => {
//     if (!editedUser.address) {
//       setAddressError("Please fill in the address field.");
//       return;
//     } else {
//       setAddressError(null);
//     }

//     if (!editedUser.dateOfBirth) {
//       setDobError("Please fill in the date of birth field.");
//       return;
//     } else {
//       const dob = new Date(editedUser.dateOfBirth);
//       const ageDifferenceMs = Date.now() - dob.getTime();
//       const ageDate = new Date(ageDifferenceMs);
//       const age = Math.abs(ageDate.getUTCFullYear() - 1970);

//       if (age < 18) {
//         setDobError("You must be at least 18 years old.");
//         return;
//       } else {
//         setDobError(null);
//       }
//     }

//     if (currentPassword && newPassword && confirmNewPassword) {
//       handlePasswordChange();
//     }

//     setLoading(true);
//     try {
//       await axios.put(`http://localhost:3001/admin/${user.email}`, editedUser);

//       toast.success("Edited successful!");
//       setEditMode(false);
//     } catch (error) {
//       toast.error("Error updating profile. Please try again later.");
//       console.error("Error updating profile:", error);
//     }
//     setLoading(false);

//     // if (profilePicture) {
//     //   const formData = new FormData();
//     //   formData.append("profilePicture", profilePicture);
//     //   try {
//     //     const uploadResponse = await axios.post(
//     //       "http://localhost:3001/admins/upload-profile-picture",
//     //       formData,
//     //       {
//     //         headers: {
//     //           "Content-Type": "multipart/form-data",
//     //         },
//     //       }
//     //     );
//     //     console.log("Profile picture uploaded:", uploadResponse.data.fileName);
//     //   } catch (error) {
//     //     console.error("Error uploading profile picture:", error);
//     //   }
//     // }
//   };

//   const handleEditProfile = () => {
//     setEditMode(!editMode);
//     if (!editMode) {
//       const clonedUser = { ...user };
//       if (clonedUser.dateOfBirth) {
//         const dob = new Date(clonedUser.dateOfBirth);
//         const formattedDob = dob.toISOString().split("T")[0];
//         clonedUser.dateOfBirth = formattedDob;
//       }
//       setEditedUser(clonedUser);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     if (name === "dateOfBirth") {
//       const formattedDate = new Date(value).toISOString().split("T")[0];
//       formattedValue = formattedDate;
//     }

//     const updatedUser = { ...editedUser, [name]: formattedValue };

//     setEditedUser(updatedUser);
//   };

//   const handlePasswordChange = async () => {
//     if (!currentPassword || !newPassword || !confirmNewPassword) {
//       setPasswordError("Please fill in all password fields.");
//       return;
//     } else {
//       setPasswordError(null);
//     }

//     if (newPassword !== confirmNewPassword) {
//       setPasswordError("New password and confirm new password must match.");
//       return;
//     } else {
//       setPasswordError(null);
//     }

//     if (currentPassword === newPassword) {
//       setPasswordError(
//         "New password must be different from the current password."
//       );
//       return;
//     } else {
//       setPasswordError(null);
//     }

//     setLoading(true);
//     try {
//       const response = await axios.put(
//         `http://localhost:3001/admin/change-password/${user.email}`,
//         {
//           currentPassword,
//           newPassword,
//         }
//       );
//       toast.success(response.data.message);
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmNewPassword("");
//       setPasswordChangeSuccess(true);
//     } catch (error) {
//       toast.error("Error changing password. Please try again later.");
//       console.error("Error changing password:", error);
//     }
//     setLoading(false);
//   };

//   // const handleProfilePictureUpload = (e) => {
//   //   const file = e.target.files[0];
//   //   setProfilePicture(file);
//   // };
//   const handleProfilePictureUpload = async (e) => {
//     const file = e.target.files[0];
//     setProfilePicture(file);

//     const formData = new FormData();
//     formData.append("image", file);
//     try {
//       const uploadResponse = await axios.post(
//         "http://localhost:3001/admins/upload-profile-picture",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       const fileName = uploadResponse.data.url;

//       const updatedUser = { ...editedUser, profilePicture: fileName };
//       setEditedUser(updatedUser);
//       console.log("Profile picture uploaded:", fileName);
//     } catch (error) {
//       console.error("Error uploading profile picture:", error);
//     }
//   };
//   const fetchProfilePicture = async (fileName) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/uploads/${fileName}`, {
//         responseType: 'blob'
//       });
//       const data = response.data
//       console.log(response.data)
//       const imageUrl = URL.createObjectURL(data);

//       setProfilePicture(imageUrl);
//     } catch (error) {
//       console.error("Error fetching profile picture:", error);
//     }
//   };

//   return (
//     <div className="profile-container">
//       <Helmet>
//         <title>Profile Page</title>
//       </Helmet>
//       <div className="profile-header">
//         <div className="profile-header-content">
//           <div>
//             <img
//               className="profile-avatar"
//               src={profilePicture ? URL.createObjectURL(profilePicture) : image}
//               alt={`${user?.name}'s avatar`}
//             />
//             {editMode && (
//               <input
//                 type="file"
//                 onChange={(e) => handleProfilePictureUpload(e)}
//               />
//             )}
//             <h2 className="profile-name">{user?.name}</h2>
//           </div>
//         </div>
//         <button className="profile-edit-btn" onClick={handleEditProfile}>
//           <FaEdit className="edit-icon" />{" "}
//           {editMode ? "Cancel" : "Edit Profile"}
//         </button>
//       </div>
//       <div className="profile-details">
//         <h3 className="profile-section-title">Personal Information</h3>
//         <div className="profile-info-grid">
//           <div className="profile-info-item">
//             <div className="info-label">
//               <FaEnvelope className="info-icon" size={18} />
//               <p className="info-text">Email:</p>
//             </div>
//             <div>
//               <p className="info-value">{user?.email}</p>
//             </div>
//           </div>
//           <div className="profile-info-item">
//             <div className="info-label">
//               <FaMapMarkerAlt className="info-icon" size={18} />
//               <p className="info-text">Address:</p>
//             </div>
//             {editMode ? (
//               <input
//                 type="text"
//                 name="address"
//                 value={editedUser?.address || ""}
//                 onChange={handleInputChange}
//                 className="info-input"
//               />
//             ) : (
//               <div>
//                 <p className="info-value">{user?.address}</p>
//               </div>
//             )}
//             {addressError && <p className="error-text">{addressError}</p>}
//           </div>
//           <div className="profile-info-item">
//             <div className="info-label">
//               <FaBirthdayCake className="info-icon" size={18} />
//               <p className="info-text">Date of Birth:</p>
//             </div>
//             {editMode ? (
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={editMode ? editedUser?.dateOfBirth || "" : ""}
//                 onChange={handleInputChange}
//                 className="info-input"
//               />
//             ) : (
//               <div>
//                 <p className="info-value">
//                   {user?.dateOfBirth
//                     ? new Date(user.dateOfBirth).toLocaleDateString("en-CA")
//                     : ""}
//                 </p>
//               </div>
//             )}
//             {dobError && <p className="error-text">{dobError}</p>}
//           </div>

//           <div className="profile-info-item">
//             <div className="info-label">
//               <FaLock className="info-icon" size={18} />
//               <p className="info-text">Change Password:</p>
//             </div>

//             {editMode ? (
//               <>
//                 <div className="password-input-container">
//                   <input
//                     type={showCurrentPassword ? "text" : "password"}
//                     placeholder="Current Password"
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     className="info-input"
//                   />
//                   <button
//                     className="eye-button"
//                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                   >
//                     {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 <div className="password-input-container">
//                   <input
//                     type={showNewPassword ? "text" : "password"}
//                     placeholder="New Password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="info-input"
//                   />
//                   <button
//                     className="eye-button"
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                   >
//                     {showNewPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 <div className="password-input-container">
//                   <input
//                     type={showConfirmNewPassword ? "text" : "password"}
//                     placeholder="Confirm New Password"
//                     value={confirmNewPassword}
//                     onChange={(e) => setConfirmNewPassword(e.target.value)}
//                     className="info-input"
//                   />
//                   <button
//                     className="eye-button"
//                     onClick={() =>
//                       setShowConfirmNewPassword(!showConfirmNewPassword)
//                     }
//                   >
//                     {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 {passwordError && <p className="error-text">{passwordError}</p>}
//                 {/* <button className="primary-btn" onClick={handlePasswordChange}>
//                   Change Password
//                 </button> */}
//               </>
//             ) : (
//               <div>
//                 <p className="info-value">**********</p>
//               </div>
//             )}
//           </div>

//           {editMode && (
//             <div className="save-btn-container">
//               <button className="save-btn" onClick={handleSaveProfile}>
//                 Save
//               </button>
//             </div>
//           )}
//         </div>
//         <div className="below">
//           <button className="primary-btn" onClick={handleLogout}>
//             <FaSignOutAlt className="logout-icon" /> Logout
//           </button>
//           <Link to="/adminhome" className="primary-btn">
//             Back
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
