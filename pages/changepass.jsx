import React, { useState, useEffect } from "react";
import PosterLayout from "../layouts/PosterLayout";
import ChangePass from "../components/Poster/ChangePass/ChangePass";

const MyProfile = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [wallet, setWallet] = useState({
    id: "",
    balance: "",
    password_payment: "",
    account_id: "",
    payment_id: "",
  });
  return (
    <PosterLayout
      setUser={setUser}
      setWallet={setWallet}
      user={user}
      wallet={wallet}
    >
      <ChangePass />
    </PosterLayout>
  );
};

export default MyProfile;
