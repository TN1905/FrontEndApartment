import React, { useState, useEffect } from "react";
import PosterLayout from "../layouts/PosterLayout";
import AxpiredApartmentPage from "../components/Poster/AxpiredApartment/AxpiredApartment";
import { getApartmentRent } from "@/api/rentApartment/rentalApartment";
const MyAxpiredApartment = () => {
  const [rentApartments, setRentApartments] = useState([]);

  useEffect(() => {
    const fetchRentApartments = async () => {
      const data = await getApartmentRent();
      setRentApartments(data);
      //console.log("data của rental", data);
    };
    fetchRentApartments();
  }, []);

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
  useEffect(() => {
    console.log("Thông tin user:", user);
  }, [user]);
  return (
    <PosterLayout
      setUser={setUser}
      setWallet={setWallet}
      user={user}
      wallet={wallet}
    >
      <AxpiredApartmentPage
        loadRentApartments={rentApartments}
      />
    </PosterLayout>
  );
};

export default MyAxpiredApartment;
