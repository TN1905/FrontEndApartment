import React, { useContext } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Inter as FontSans } from "next/font/google";
import { cn } from "../../lib/utils";
import RentApartment from "../../components/Apartment/RentApartment";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const RentApart = () => {
    
  return (
    <>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-[1440px] mx-auto bg-white",
          fontSans.variable
        )}
      >
        <MainLayout>
          <RentApartment />
        </MainLayout>
      </div>
    </>
  );
};

export default RentApart;
