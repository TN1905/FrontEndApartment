import React, { useContext } from "react";
import MainLayout from "../../layouts/MainLayout";
import Home from "../../components/Apartment/Home";
import { Inter as FontSans } from "next/font/google";
import { cn } from "../../lib/utils";
import PropertyDetails from "../../components/Apartment/PropertyDetails";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const Detail = () => {

  return (
    <>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-[1440px] mx-auto bg-white",
          fontSans.variable
        )}
      >
        <MainLayout>
          <PropertyDetails />
        </MainLayout>
      </div>
    </>
  );
};

export default Detail;
