import React, { useState, useEffect, useContext } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import UserManagement from "../../components/Admin/UserManage";
const MyUserManagement = () => {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  );
};

export default MyUserManagement;
