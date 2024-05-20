import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Users/Signup";
import Login from "./Users/Login";
import Home from "./Users/Home";
import Admin from "./Admin/Admin";
import ForgotPassword from "./Users/ForgetPassword";
import ForgotPasswordAdmin from "./Admin/ForgetPasswordAdmin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AdminSignup from "./Admin/AdminSignUp";
import Adminhome from "./Admin/adminhome";
import Room from "./Admin/room";
import Inventory from "./Admin/inventory";
import Employee from "./Admin/employee";
import Booking from "./Admin/booking";
import UserBooking from "./Users/userBooking";
import Header from "./Admin/header";
import Menu from "./components/About/Menu";
import Contact from "./components/Banner/Contact";
import ReadMore from "./components/Banner/ReadMore";
import OurRooms from "./components/Rooms/OurRooms";
import Condition from "./components/Footer/Condition";
import BookingPage from "./components/Book/BookingPage";
import Profile from "./Admin/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const localUserData =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  const localAdminData =
    localStorage.getItem("adminuser") !== "undefined"
      ? JSON.parse(localStorage.getItem("adminuser"))
      : null;

  return (
    <div>
      <ToastContainer />
      {/* <Toaster /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Signup"
            element={localUserData ? <Home /> : <Signup />}
          />
          <Route path="/Login" element={localUserData ? <Home /> : <Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Condition" element={<Condition />} />
          <Route
            path="/admin"
            element={localAdminData ? <Adminhome /> : <Admin />}
          />
          {/* <Route
            path="/AdminSignup"
            element={localAdminData ? <Adminhome /> : <AdminSignup />}
          /> */}
          <Route
            path="/AdminSignup"
            element={localAdminData ? <Adminhome /> : <Admin />}
          />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/BookingPage/:roomId" element={<BookingPage />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Rooms" element={<OurRooms />} />
          <Route
            path="/ForgotPasswordAdmin"
            element={<ForgotPasswordAdmin />}
          />
          <Route path="/ReadMore" element={<ReadMore />} />
          <Route path="/Profile" element={<Profile />} />
          <Route
            path="/adminhome"
            element={
              <>
                <Header />
                <Adminhome />
              </>
            }
          />
          <Route
            path="/booking"
            element={
              localAdminData ? (
                <>
                  <Header />
                  <Booking />
                </>
              ) : (
                <Admin />
              )
            }
          />
          <Route
            path="/employee"
            element={
              localAdminData ? (
                <>
                  <Header />
                  <Employee />
                </>
              ) : (
                <Admin />
              )
            }
          />
          <Route
            path="/inventory"
            element={
              localAdminData ? (
                <>
                  <Header />
                  <Inventory />
                </>
              ) : (
                <Admin />
              )
            }
          />
          <Route
            path="/room"
            element={
              localAdminData ? (
                <>
                  <Header />
                  <Room />
                </>
              ) : (
                <Admin />
              )
            }
          />
          <Route path="/userBooking" element={<UserBooking />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
