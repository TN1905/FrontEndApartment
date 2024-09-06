import React, { useState, useEffect, useContext } from "react";
import { getApartmentImage } from "../../api/uploadImage/getApartmentImage";
import { getFavorites } from "../../api/favorites/getFavorites";
import { createFavorites } from "../../api/favorites/createFavorites";
import { removeFavorites } from "../../api/favorites/removeFavorite";
import { getApartmentOne } from "../../api/apartments/getApartmentOne";
import { HouseContext } from "./HouseContext";
import Link from "next/link";

const FavoriteItem = ({ apartment, removeApartment }) => {
  const { user } = useContext(HouseContext);
  const [image, setImage] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log(".............");
    const fetchData = async () => {
      try {
        const imageData = await getApartmentImage(apartment.id);
        setImage(imageData);
        console.log(image);
        const favoriteData = await getFavorites(user.id, apartment.id);
        if (favoriteData) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [apartment.id, user.id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        console.log("ssacas");
        const existingFavorites = await getFavorites(user.id, apartment.id);
        if (existingFavorites) {
          
          console.log(apartment.id);
          removeApartment(apartment.id);
          console.log("ssss");
          await removeFavorites(existingFavorites.id);
          
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={image[0]?.imageData}
          alt="Apartment Image"
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        ;
        <div className="absolute top-2 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
          <svg
            onClick={toggleFavorite}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer"
          >
            {isFavorite ? (
              <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                fill="red"
                stroke="red"
              />
            ) : (
              <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                fill="white"
                stroke="currentColor"
              />
            )}
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 h-6 overflow-hidden">
          {apartment.content}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">
            {apartment.price.toLocaleString("vi-VN")}/month
          </span>
          <span className="text-muted-foreground">{apartment.acreage}/m2</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">
            {apartment.apartmentType.name}
          </span>
        </div>
        <p className="text-muted-foreground overflow-hidden h-12">
          {apartment.address}, {apartment.ward} {apartment.district}{" "}
          {apartment.city}
        </p>
      </div>
    </div>
  );
};

export default FavoriteItem;


