import React, { useState, useEffect, useContext } from "react";
import { getApartmentImage } from "../../api/uploadImage/getApartmentImage";
import { getFavorites } from "../../api/favorites/getFavorites";
import { createFavorites } from "../../api/favorites/createFavorites";
import { removeFavorites } from "../../api/favorites/removeFavorite";
import { getApartmentOne } from "../../api/apartments/getApartmentOne";
import { HouseContext } from "./HouseContext";
import Link from "next/link";

const House = ({ house }) => {
  const {
    id,
    content,
    ward,
    district,
    city,
    address,
    price,
    acreage,
    createdate,
    description,
    apartmentType,
  } = house;

  const { user } = useContext(HouseContext);
  const [image, setImage] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imageData = await getApartmentImage(id);
        if (imageData) {
          setImage(imageData);
        }

        // Fetch and set initial favorite status
        if (user && user.id) {
          const favoriteData = await getFavorites(user.id, id);
          setIsFavorite(!!favoriteData);
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !user.id) return;

    try {
      if (isFavorite) {
        // Remove from favorites
        const existingFavorites = await getFavorites(user.id, id);
        if (existingFavorites) {
          await removeFavorites(existingFavorites.id);
        }
        setIsFavorite(false);
      } else {
        // Add to favorites
        const apartment = await getApartmentOne(id);
        const data = {
          id: Date.now().toString(),
          account: user,
          apartment: apartment,
        };
        await createFavorites(data);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div
      className="bg-white shadow-xl p-5 rounded-lg rounded-tl-[90px] w-full max-w-[352px]
    mx-auto cursor-pointer hover:shadow-2xl transition relative"
    >
      <Link href={`/detail/[id]`} as={`/detail/${house.id}`}>
        <img
          className="mb-8 w-[321px] h-[312px] rounded-tl-[70px]"
          src={image[0]?.imageData}
          alt=""
        />
      </Link>
      <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
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
      <div className="mb-4 flex gap-x-2 text-sm">
        <div className="bg-green-500 rounded-full text-white px-3 ">
          {apartmentType?.name}
        </div>
        <div className="bg-violet-500 rounded-full text-white px-3">{city}</div>
      </div>
      <div className="text-lg font-semibold max-w-[260px] max-h-5 leading-5 overflow-hidden">
        {content}
      </div>
      <div className="flex gap-x-4 my-4">
        <div className="flex items-center text-gray-600 gap-1">
          <div>{acreage} m2</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div>{price.toLocaleString("vi-VN")} Đ</div>
        </div>
        <div className="flex items-center text-gray-600 gap-1">
          <div className="text-[20px]">
            <CalendarIcon className="text-muted-foreground" />
          </div>
          <div>{createdate}</div>
        </div>
      </div>
      <div className="text-lg font-semibold text-violet-600 mb-4 max-h-6 overflow-hidden">
        {address}
      </div>
    </div>
  );
};

export default House;

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
