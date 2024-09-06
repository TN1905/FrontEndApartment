import React, { useState, useLocation, useEffect,useContext } from "react";
import NavLink from "./NavLink";
import { HouseContext } from "../Apartment/HouseContext";
import { getWallet } from "../../api/wallet/getWallet";
import { nav_icon, notif_icon, search_icon } from "../../utils/svgs";
import Link from "next/link";
let userImg =
  "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
let navUser = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Change Pass",
    href: "/changepass",
  },
  {
    title: "Transaction",
    href: "/transaction",
  },
  {
    title: "Rented Apartment",
    href: "/rentedapartment",
  },
];

let navPoster = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Change Pass",
    href: "/changepass",
  },
  {
    title: "Transaction",
    href: "/transaction",
  },
  {
    title: "Apartment",
    href: "/apartment",
  },
  {
    title: "Upload Apartment",
    href: "/upload",
  },
  {
    title: "Rented Apartment",
    href: "/rentedapartment",
  },
  {
    title: "Manager Rented",
    href: "/manage-rented-apartment",
  },
  {
    title: "Axpired Apartment",
    href: "/axpiredapartment",
  },
];

let navAdmin = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Change Pass",
    href: "/changepass",
  },
  {
    title: "Transaction",
    href: "/transaction",
  },
  {
    title: "Apartment",
    href: "/apartment",
  },
  {
    title: "Upload Apartment",
    href: "/upload",
  },
];


const PosterHeader = () => {
  const { user, setUser,wallet, setWallet } = useContext(HouseContext);
  const [role, setRole] = useState();

   useEffect(() => {
     const initiate = async () => {
      if (user && user.roles) {
        const walletData = await getWallet(user.id);
        console.log(walletData);
        if (walletData) {
          setWallet(walletData);
        }
        const roleData = user.roles.map((role) => role.name);
        if (roleData.includes("ADMIN")) {
          console.log("ADMIN");
          setRole("ADMIN");
        } else if (roleData.includes("POSTER")) {
          console.log("POSTER");
          setRole("POSTER");
        } else {
          console.log("USER");
          setRole("USER");
        }
      }     
     };
     initiate();
   }, [user]);

  const [active, setActive] = useState(); // Đặt giá trị mặc định cho active

  return (
    <div className="items-center justify-between flex w-full space-x-4 pb-2 pt-4 px-3">
      {/* logo */}
      <Link href="/">
        <div className="border-b border-gray-900 w-[25%] flex md:space-x-2 md:pb-6 pb-2 items-center justify-center md:justify-start">
          <img
            className="md:w-12 md:h-12 w-10 h-10 "
            src={`assets/img/logo.png`}
            alt="logo"
          />

          <h1 className="self-center hidden md:inline md:font-bold md:text-xl text-md">
            {role === "USER" ? 'USER PROFILE' : 'POSTER MANAGEMENT'}
          </h1>
        </div>
      </Link>
      {/* navlinks */}
      <div className=" border-b pb-5  border-gray-900 w-[140%] items-center justify-center flex space-x-2">
        {role === "USER" &&
          navUser.map((link, index) => (
            <div
              className="relative items-center justify-center flex "
              onClick={() => setActive(link.title)}
            >
              <NavLink title={link.title} key={index} href={link.href} />
              <div
                className={`${
                  active === link.title
                    ? "items-center justify-center flex absolute -bottom-3 "
                    : "hidden"
                }`}
              >
                {nav_icon}
              </div>
            </div>
          ))}
        {role === "POSTER" &&
          navPoster.map((link, index) => (
            <div
              className="ml-5 relative items-center justify-center flex "
              onClick={() => setActive(link.title)}
            >
              <NavLink title={link.title} key={index} href={link.href} />
              <div
                className={`${
                  active === link.title
                    ? "items-center justify-center flex absolute -bottom-3 "
                    : "hidden"
                }`}
              >
                {nav_icon}
              </div>
            </div>
          ))}
        {role === "ADMIN" &&
          navAdmin.map((link, index) => (
            <div
              className="relative items-center justify-center flex "
              onClick={() => setActive(link.title)}
            >
              <NavLink title={link.title} key={index} href={link.href} />
              <div
                className={`${
                  active === link.title
                    ? "items-center justify-center flex absolute -bottom-3 "
                    : "hidden"
                }`}
              >
                {nav_icon}
              </div>
            </div>
          ))}
      </div>
      {/* login */}
      <div className="border-b  border-gray-900 pb-6 pt-4 hidden md:flex items-center justify-end px-3 space-x-6 w-[40%]">
        <p>
          Số dư: <span>{wallet?.balance?.toLocaleString("vi-VN")} VNĐ</span>
        </p>
        <img
          src={userImg}
          className="w-8 h-8 rounded-full object-center object-cover "
          alt="userimg"
        />
      </div>
    </div>
  );
};

export default PosterHeader;
