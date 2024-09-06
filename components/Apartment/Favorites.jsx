import React, { useState,useContext,useEffect } from "react";
import { getFavoriteApartments } from "../../api/favorites/getFavoritesAccount";
import { getApartmentImage } from "../../api/uploadImage/getApartmentImage";
import { HouseContext } from "./HouseContext";
import FavoriteItem from "./FavoriteItem";
const Favorites = () => {
  const [apartment, setApartment] = useState([]);
  const [image, setImage] = useState([]);
  const { user } = useContext(HouseContext);
  const removeApartment = (apartmentId) => {
    setApartment(
      apartment.filter((apartment) => apartment.apartment.id !== apartmentId)
    );
  };
  useEffect(() => {
    const initiate = async () => {
      const data = await getFavoriteApartments(user.id);
      if (data) {
        setApartment(data);
        // const imageData = await getApartmentImage(data.id);
        //  console.log(imageData);
        // setImage(imageData);
      }
    };
    initiate();
  }, [user.id]);

  const toggleFavorite = (index) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };

  return (
    <div className="h-auto mb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Favorite Apartments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {apartment?.map((a, index) => {
            return (
              <FavoriteItem
                apartment={a.apartment}
                key={a.apartment.id}
                removeApartment={removeApartment}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
