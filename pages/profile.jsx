import React, { useState, useEffect, useContext} from "react";
import PosterLayout from "../layouts/PosterLayout";
import Profile from "../components/Poster/Profile/Profile";

const MyProfile = () => {
  
  return (
    <PosterLayout
    >
      <Profile  />
    </PosterLayout>
  );
};

export default MyProfile;
