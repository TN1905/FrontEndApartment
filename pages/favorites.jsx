import React from "react";
import MainLayout from "../layouts/MainLayout";
import Favorites from "../components/Apartment/Favorites";
const Index = () => {
  return (
    <>
      <div className="max-w-[1440px] mx-auto bg-white">
        <MainLayout>
          <Favorites />
        </MainLayout>
      </div>
    </>
  );
};

export default Index;
