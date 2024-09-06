import React, { useState, useEffect, useContext } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDashboard from "../../components/Admin/Dashboard";
const MyDashBoard = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default MyDashBoard;

