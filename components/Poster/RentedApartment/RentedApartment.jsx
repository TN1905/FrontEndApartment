import React, { useState, useEffect, useContext } from "react";
import { HouseContext } from "../../Apartment/HouseContext";
import { getWallet } from "../../../api/wallet/getWallet";
import { updateUser } from "../../../api/users/updateUser";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { getRentedApartByAccount } from "../../../api/rentApartment/getRentedApartmentByAccount";

const Profile = () => {
  const { user, setUser } = useContext(HouseContext);
  const [rentedDetail,setRentedDetail] = useState([]);

  useEffect(() => {
    const initiate = async () => {
      const apartDetail = await getRentedApartByAccount(user.id);
      if(apartDetail){
        console.log(apartDetail);
        setRentedDetail(apartDetail);
      }
    }
    initiate();
  },[])
  
  return (
    <div className=" w-full h-[90vh] items-center justify-center">
      {rentedDetail.map((data, index) => (
        <section className="bg-slate-100 py-4 sm:py-6 lg:py-8" key={index}>
          <div className="container mx-auto px-2 sm:px-3 lg:px-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Apartment Details</h3>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Apartment ID:</span>
                    <span>{data.apartment.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Type:</span>
                    <span>{data.apartment.apartmentType.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Address:</span>
                    <span className="ml-2 max-h-5 leading-5 overflow-hidden">
                      {data.apartment.address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>City:</span>
                    <span>{data.apartment.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>District:</span>
                    <span>{data.apartment.district}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ward:</span>
                    <span>{data.apartment.ward}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Rental Details</h3>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between ">
                    <span>Description:</span>
                    <span className="ml-2 max-h-10 leading-5 overflow-hidden">
                      {data.apartment.description}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Start Date:</span>
                    <span>{data.createdate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>End Date:</span>
                    <span>{data.enddate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-green-600">
                      {data.apartment.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
      <footer className="py-5 text-sm transition-all duration-300 border-t border-[#cddfff] text-center">
        <div className="items-center text-[#012970]">
          &copy; Copyrights
          <strong>
            <span> Poster</span>
          </strong>
          . All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Profile;
