import React from "react";
import MainLayout from "../layouts/MainLayout";
import Login from "../components/Login/Login";

const Index = () => {
  return (
    <>
      <div className="max-w-[1440px] mx-auto bg-white">
        <MainLayout>
          <Login />
        </MainLayout>
      </div>
    </>
  );
};

export default Index;
