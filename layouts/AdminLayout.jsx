import React from "react";
import AdminHeader from "../components/Admin/Header";
import AdminSidebar from "../components/Admin/Sidebar";
const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
