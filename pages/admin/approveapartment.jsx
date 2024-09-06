import React, { useState, useEffect, useContext } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ApproveApartment from "../../components/Admin/ApproveApartment";

const MyApprovalApartmentPage = () => {
  return (
    <AdminLayout>
      <ApproveApartment />
    </AdminLayout>
  );
};

export default MyApprovalApartmentPage;
