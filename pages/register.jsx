import React from "react";
import MainLayout from "../layouts/MainLayout";
import Register from "../components/Login/Register";


const MyProfile = () => {
  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      <MainLayout>
        <Register />
      </MainLayout>
    </div>
  );
};

export default MyProfile;
