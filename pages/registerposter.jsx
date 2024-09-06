import React from "react";
import MainLayout from "../layouts/MainLayout";
import RegisterPoster from "../components/Apartment/RegisterPoster";
const Index = () => {
  return (
    <>
      <div className="max-w-[1440px] mx-auto bg-white">
        <MainLayout>
          <RegisterPoster />
        </MainLayout>
      </div>
    </>
  );
};

export default Index;
