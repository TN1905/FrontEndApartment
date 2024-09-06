import React, {useContext, useEffect} from 'react';

// import conponents
import Banner from "./Banner"
import HouseList from "./HouseList";


const Home = () => {
  return (
    <div className="min-h-[1800px]">
      <Banner />
      <HouseList />
    </div>
  );
};

export default Home;
