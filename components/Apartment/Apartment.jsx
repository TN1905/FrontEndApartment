import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
// import Header and Footer,Home, PropertyDetails
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home.jsx";
import PropertyDetails from "./PropertyDetails.jsx";


const Apartment = () => {
    return (
      <div className="max-w mx-auto bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Routes>
        <Footer />
      </div>
    );
}

export default Apartment;