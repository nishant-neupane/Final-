import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaArrowLeft } from "react-icons/fa";
import "./About.css";

function Menu() {
  return (
    <div className="desc-container">
      <Helmet>
        <title>Menu</title>
        <meta name="description" content="Page description" />
      </Helmet>
      <div className="header-desc">
        <table className="menu-table">
          <thead>
            <div className="space">
              <Link to="/" className="back-link">
                <FaArrowLeft className="back-icon-desc" />
              </Link>
              <h1 className="menu-heading">Menu</h1>
            </div>
            <tr>
              <th className="food-item-heading">Food Item</th>
              <th className="price-heading">Price (NPR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="food-item">Dal Bhat</td>
              <td className="price">200</td>
            </tr>
            <tr>
              <td className="food-item">Momo</td>
              <td className="price">150</td>
            </tr>
            <tr>
              <td className="food-item">Thukpa</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Sel Roti</td>
              <td className="price">100</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Curry</td>
              <td className="price">250</td>
            </tr>
            <tr>
              <td className="food-item">Vegetable Chow Mein</td>
              <td className="price">200</td>
            </tr>
            <tr>
              <td className="food-item">Buff Momo</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Paneer Tikka</td>
              <td className="price">220</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Chowmein</td>
              <td className="price">230</td>
            </tr>
            <tr>
              <td className="food-item">Veg Fried Rice</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Vegetable Momos</td>
              <td className="price">160</td>
            </tr>
            <tr>
              <td className="food-item">Paneer Butter Masala</td>
              <td className="price">240</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Biryani</td>
              <td className="price">280</td>
            </tr>
            <tr>
              <td className="food-item">Thali (Vegetarian)</td>
              <td className="price">220</td>
            </tr>
            <tr>
              <td className="food-item">Thali (Non-Vegetarian)</td>
              <td className="price">280</td>
            </tr>
            <tr>
              <td className="food-item">Plain Rice</td>
              <td className="price">100</td>
            </tr>
            <tr>
              <td className="food-item">Garlic Naan</td>
              <td className="price">80</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Fried Rice</td>
              <td className="price">250</td>
            </tr>
            <tr>
              <td className="food-item">Gulab Jamun (2 pcs)</td>
              <td className="price">120</td>
            </tr>
            <tr>
              <td className="food-item">
                Ice Cream (Vanilla/Chocolate/Strawberry)
              </td>
              <td className="price">100</td>
            </tr>
            <tr>
              <td className="food-item">Aloo Paratha</td>
              <td className="price">120</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Momos</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Palak Paneer</td>
              <td className="price">220</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Tikka Masala</td>
              <td className="price">260</td>
            </tr>
            <tr>
              <td className="food-item">Pork Sekuwa</td>
              <td className="price">280</td>
            </tr>
            <tr>
              <td className="food-item">Fried Fish</td>
              <td className="price">200</td>
            </tr>
            <tr>
              <td className="food-item">Vegetable Pulao</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Butter Chicken</td>
              <td className="price">250</td>
            </tr>
            <tr>
              <td className="food-item">Plain Dosa</td>
              <td className="price">150</td>
            </tr>
            <tr>
              <td className="food-item">Idli Sambar (2 pcs)</td>
              <td className="price">140</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Chow Chow</td>
              <td className="price">220</td>
            </tr>
            <tr>
              <td className="food-item">Veg Hakka Noodles</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Sizzler</td>
              <td className="price">300</td>
            </tr>
            <tr>
              <td className="food-item">Vegetable Korma</td>
              <td className="price">200</td>
            </tr>
            <tr>
              <td className="food-item">Prawn Curry</td>
              <td className="price">280</td>
            </tr>
            <tr>
              <td className="food-item">Chicken Kebab</td>
              <td className="price">240</td>
            </tr>
            <tr>
              <td className="food-item">Vegetable Manchurian</td>
              <td className="price">180</td>
            </tr>
            <tr>
              <td className="food-item">Rasmalai (2 pcs)</td>
              <td className="price">160</td>
            </tr>
            <tr>
              <td className="food-item">Gajar Halwa</td>
              <td className="price">140</td>
            </tr>
            <tr>
              <td className="food-item">Butter Naan</td>
              <td className="price">70</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Menu;
