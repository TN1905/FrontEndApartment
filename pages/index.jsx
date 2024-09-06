import React, {useContext,useEffect} from "react";
import MainLayout from "../layouts/MainLayout";
import Home from "../components/Apartment/Home";
import { Inter as FontSans } from "next/font/google";
import { HouseContext } from "../components/Apartment/HouseContext";
import { cn } from "../lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const Index = () => {
  

  return (
      <div
        className="min-h-screen bg-background font-sans antialiased max-w-[1440px] mx-auto bg-white"
      >
        <MainLayout>
          <Home />
        </MainLayout>
      </div>
  );
};

export default Index;


