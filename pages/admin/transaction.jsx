import React, { useState, useEffect, useContext } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import Transaction from "../../components/Admin/Transaction";
const MyTransaction = () => {
  return <AdminLayout>
        <Transaction />
      </AdminLayout>;
};

export default MyTransaction;
