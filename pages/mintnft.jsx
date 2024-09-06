import React from "react";
import MainLayout from "../layouts/MainLayout";
import MintNFT from "../components/NFT/mintnft";

const MyMintNFT = () => {
  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      <MainLayout>
        <MintNFT />
      </MainLayout>
    </div>
  );
};

export default MyMintNFT;
