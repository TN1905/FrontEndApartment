import React, { useContext, useMemo, useEffect, useState} from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../../hooks/useTranslation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { loadLocation } from "../../api/loadLocation/loadLocation";
import { getAllApartmentType } from "../../api/apartmentType/getApartmentType";
import { HouseContext } from './HouseContext';
const Search = () => {
  const {
    district,
    setDistrict,
    ward,
    setWard,
    districtValue,
    setDistrictValue,
    wardValue,
    setWardValue,
    cityName,
    setCityName,
    districtName,
    setDistrictName,
    wardName,
    setWardName,
    filter,
    apartTypeId, 
    setApartTypeId,
    priceFilter,
    setPriceFilter,
    acreageFilter,
    setAcreageFilter,
    searchContent, 
    setSearchContent
  } = useContext(HouseContext);
   const [loadLocationData, setLoadLocationData] = useState([]);
   const [apartmentTypeData,setApartmentTypeData] = useState([]);
   const { t } = useTranslation();

   const handleAdvanceFilter = () => {
    filter();
   }


  const loadDistrict = (cityId) => {
    const districtData = loadLocationData.find((data) => data.Id === cityId);
    console.log(districtData)
    if (districtData) {
      setCityName(districtData.Name);
      setDistrictName("");
      setWardName("");
      setWard([]);
      setWardValue("wardDefault");
      setDistrictValue("districtDefault");
      setDistrict(districtData.Districts);
    }
    filter();
  };


   const loadWards = (districtId) => {
     const wardData = district.filter((data) => {
       return data.Id === districtId;
     });
     if (wardData && districtId !== "" && districtId !== "districtDefault") {
       setDistrictName(wardData[0].Name);
       setDistrictValue(districtId);
       setWardValue("wardDefault");
       setWard(wardData[0].Wards);
       setWardName("");
     } 
     filter();
   };

   const handleWardId = (wardId) => {
    if(wardId && wardId !== "" && wardId !== "wardDefault"){
      const wardname = ward.find((w) => {
        return w.Id === wardId;
      });
      setWardValue(wardId);
      setWardName(wardname.Name);
    }
   };

   const handleApartTypeId = (apartTypeId) => {
     setApartTypeId(apartTypeId);
   };

   const handlePriceChange = (value) => {
    const data = value[0];
     setPriceFilter(data);
   };

   const handleAcreageChange = (value) => {
    const data = value[0];
     setAcreageFilter(data);
   };

   const handleSearchContent = (value) => {
    console.log(value);
    setSearchContent(value);
   }

   useEffect(() => {
    const initiateData = async () => {
      const location = await loadLocation();
      const apartTypeData = await getAllApartmentType();
      setLoadLocationData(location);
      setApartmentTypeData(apartTypeData);
      console.log(location);
      console.log(apartTypeData);
    };
    initiateData();
   },[]);

  return (
    <div
      className="px-[30px] py-6 max-w-[1170px] mx-auto border-gray-100 bg-white lg:shadow-sm border 
  lg:bg-transparent lg:backdrop-blur rounded-lg lg:-top-16
 gap-4 lg:gap-x-3 relative z-50"
    >
      <div className="grid gap-6 sm:gap-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <Select onValueChange={(value) => loadDistrict(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("select_city")} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {loadLocationData.map((data, index) => (
                <SelectItem
                  key={index}
                  value={data.Id}
                  className="hover:bg-slate-200"
                >
                  {data.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => loadWards(value)}
            value={districtValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="districtDefault">
                {t("select_district")}
              </SelectItem>

              {district?.map((data, index) => (
                <SelectItem
                  key={index}
                  value={data.Id}
                  className="hover:bg-slate-200"
                >
                  {data.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={wardValue}
            onValueChange={(value) => handleWardId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_ward")} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="wardDefault">
                {t("select_district")}
              </SelectItem>
              {ward?.map((data, index) => (
                <SelectItem
                  key={index}
                  value={data.Id}
                  className="hover:bg-slate-200"
                >
                  {data.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search_for_properties")}
              className="pl-10 pr-4 h-10 rounded-md bg-white text-muted-foreground 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              onChange={(e) => {
                handleSearchContent(e.target.value);
              }}
            />
          </div>
          {/* <Button variant="outline" className="h-10 shrink-0">
            <FilterIcon className="w-5 h-5" />
            Filter
          </Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-10 shrink-0">
                <FilterIcon className="w-5 h-5 mr-2" />
                {t("advance_filter")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>{t("advance_filter")}</DialogTitle>
                <DialogDescription>
                  {t("advance_filter_refine")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <label htmlFor="price-range" className="text-sm font-medium">
                    {t("price_range")}
                  </label>
                  <Slider
                    id="price-range"
                    min={1000000}
                    max={15000000}
                    step={1000000}
                    value={[priceFilter || 1000000]}
                    onValueChange={handlePriceChange}
                    className="bg-slate-200"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("price")}:{priceFilter.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <span className="text-sm font-medium">
                      {15000000?.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="acreage-range"
                    className="text-sm font-medium"
                  >
                    {t("acreage")}:
                  </label>
                  <Slider
                    id="acreage-range"
                    min={10}
                    max={200}
                    step={10}
                    value={[acreageFilter || 10]}
                    onValueChange={handleAcreageChange}
                    className="bg-slate-200"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("acreage")}: {acreageFilter} m2
                    </span>
                    <span className="text-sm font-medium">200</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="apartment-type"
                    className="text-sm font-medium"
                  >
                    {t("apartment_type")}
                  </label>
                  <Select
                    id="apartment-type"
                    onValueChange={(value) => handleApartTypeId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_apartment_type")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {apartmentTypeData.map((data, index) => (
                        <SelectItem
                          key={index}
                          value={data.id}
                          className="hover:bg-slate-200"
                        >
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <div>
                  <Button variant="ghost">{t("cancel")}</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Search;

function FilterIcon(props) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
