import React, { useState, useEffect, useContext } from "react";
// import context
import { HouseContext } from "./HouseContext";
import { Button } from "@/components/ui/button";
import {getFavoriteApartments } from "../../api/favorites/getFavoritesAccount";
// import components
import House from "./House";
import { useTranslation } from "../../hooks/useTranslation";
// import icons
import { ImSpinner2 } from "react-icons/im";

const HouseList = () => {
  const {
    loading,
    currentPage,
    setCurrentPage,
    houses,
    setHouses,
    paginateHouses,
    prePage,
    nextPage,
    changePage,
    numbers,
    records,
    filter,
  } = useContext(HouseContext);
  const { t } = useTranslation();
  useEffect(() => {
    filter();
  }, [filter]);

  // If loading is true
  if (loading) {
    return (
      <ImSpinner2 className="mx-auto animate-spin text-violet-700 text-4xl mt-[200px]" />
    );
  }

  if (houses.length < 1) {
    return (
      <div className="text-center text-3xl text-gray-400 mt-48">
        Sorry, nothing found
      </div>
    );
  }

  return (
    <section className="mb-20">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-14">
          {records?.map((house, index) => {
            return <House house={house} key={house.id} />;
          })}
        </div>
        <div className="flex items-center gap-2 w-full mt-8 justify-center">
          <Button
            variant="outline"
            className="px-3 py-2 rounded-md"
            onClick={prePage}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("previous")}
          </Button>
          <div className="flex items-center gap-2 justify-center">
            {numbers?.map((n, i) => (
              <Button
                variant="outline"
                className={`px-3 py-2 rounded-md ${
                  currentPage === n ? "bg-black text-white" : ""
                }`}
                onClick={() => changePage(n)}
                key={i}
              >
                {n}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="px-3 py-2 rounded-md"
            onClick={nextPage}
          >
            {t("next")}
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HouseList;

function ArrowLeftIcon(props) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon(props) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
