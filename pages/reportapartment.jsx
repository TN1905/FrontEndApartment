import React, { useState, useEffect } from "react";
import PosterLayout from "../layouts/PosterLayout";
import { loadLocation } from "@/api/loadLocation/loadLocation";
import { getAllApartmentType } from "@/api/apartmentType/getApartmentType";
import ReportApartmentPage from "../components/Poster/ReportApartment/ReportApartment";

const MyReportApartment = () => {
  const [locationData, setLocationData] = useState([]);
  const [apartmentTypeData, setApartmentTypeData] = useState([]);

  useEffect(() => {
    const initiateData = async () => {
      const location = await loadLocation();
      const apartTypeData = await getAllApartmentType();
      setLocationData(location);
      setApartmentTypeData(apartTypeData);
    };
    initiateData();
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
  return (
    <PosterLayout
      setUser={setUser}
      setWallet={setWallet}
      user={user}
      wallet={wallet}
    >
      <ReportApartmentPage
        loadLocationData={locationData}
        apartmentTypeData={apartmentTypeData}
      />
    </PosterLayout>
  );
};

export default MyReportApartment;
