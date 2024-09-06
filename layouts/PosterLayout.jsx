// components/layouts/PosterLayout.tsx
import React, { useEffect,useState } from "react";
import PosterHeader from "../components/Poster/PosterHeader";
import Navbar from "../components/Poster/Navbar";
import { getUser } from "../api/users/getUsers";
import { getWallet } from "../api/wallet/getWallet";

const PosterLayout = ({ children, setUser, user, wallet, setWallet }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletData = await getWallet();
        const userData = await getUser();
        setUser(userData);
        setWallet(walletData);
        console.log(userData);
        console.log(walletData);
      } catch (error) {
        console.error("Failed to fetch User or Wallet", error);
      }
    };

    fetchData();
  }, [setUser, setWallet]);

  return (
    <div className="App h-screen w-full scrollbar-hide overflow-x-hidden px-6">
      <PosterHeader wallet={wallet} />
      <div className="flex items-start space-x-2 justify-start w-full ">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default PosterLayout;
