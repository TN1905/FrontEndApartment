import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import PosterHeader from "./PosterHeader";
import WalletPage from "./WalletPage/WalletPage"
import PosterManage from "./PosterManage/PosterManage";
import PosterUpload from "./PosterUpload/PosterUpload";
import DepositeTransaction from "./DepositeTransaction/DepositeTransaction";
import HistoryTransaction from "./HistoryTransaction/HistoryTransaction";
import Profile from "./Profile/Profile";
import Navbar from "./Navbar";
const PosterDashboard = () => {
    return (
      <div className="App h-screen overflow-y-scroll scrollbar-hide overflow-x-hidden px-6">
        <PosterHeader />
        <div className="flex items-start space-x-2 justify-start w-full ">
          <Navbar />
          <Routes>
            <Route path="/WalletPage" element={<WalletPage />} />
            <Route path="/PosterManage" element={<PosterManage />} />
            <Route path="/PosterUpload" element={<PosterUpload />} />
            <Route
              path="/DepositeTransaction"
              element={<DepositeTransaction />}
            />
            <Route
              path="/HistoryTransaction"
              element={<HistoryTransaction />}
            />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    );
}

export default PosterDashboard;