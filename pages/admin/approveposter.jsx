import React, { useState, useEffect, useContext } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ApproveRegisterPoster from "../../components/Admin/ApproveRegister";

const MyApprovePoster = () => {
  return (
    <AdminLayout>
      <ApproveRegisterPoster />
    </AdminLayout>
  );
};

export default MyApprovePoster;
