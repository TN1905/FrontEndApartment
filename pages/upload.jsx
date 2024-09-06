import React, { useState, useEffect } from "react";
import PosterLayout from "../layouts/PosterLayout";
import Upload from "../components/Poster/PosterUpload/PosterUpload";
import { loadLocation } from "../api/loadLocation/loadLocation";
import { getAllApartmentType } from "../api/apartmentType/getApartmentType";
const MyProfile = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [locationData,setLocationData] = useState([]);
  const [apartmentTypeData, setApartmentTypeData] = useState([]);

  useEffect(() => {
    const initiateData = async () => {
      const location = await loadLocation();
      const apartTypeData = await getAllApartmentType();
      setLocationData(location);
      setApartmentTypeData(apartTypeData);
      console.log(location);
      console.log(apartTypeData);
    }
    initiateData();
  },[]);

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
      <Upload
        loadLocationData={locationData}
        apartmentTypeData={apartmentTypeData}
      />
    </PosterLayout>
  );
};

export default MyProfile;
