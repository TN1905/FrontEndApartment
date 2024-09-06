import React, { useState, useEffect } from "react";
import { loadLocation } from "../../api/loadLocation/loadLocation";
import { getAllApartmentType } from "../../api/apartmentType/getApartmentType";
import AdminLayout from "../../layouts/AdminLayout";
import UploadApartment from "../../components/Admin/UploadApartment";
const MyUploadApartment = () => {
  const [locationData, setLocationData] = useState([]);
  const [apartmentTypeData, setApartmentTypeData] = useState([]);

  useEffect(() => {
    const initiateData = async () => {
      const location = await loadLocation();
      const apartTypeData = await getAllApartmentType();
      setLocationData(location);
      setApartmentTypeData(apartTypeData);
      console.log(location);
      console.log(apartTypeData);
    };
    initiateData();
  }, []);


  return (
    <AdminLayout
    >
      <UploadApartment
        loadLocationData={locationData}
        apartmentTypeData={apartmentTypeData}
      />
    </AdminLayout>
  );
};

export default MyUploadApartment;
