interface House {
  id: string;
  content: string;
  ward: string;
  district: string;
  city: string;
  address: string;
  price: number;
  acreage: number;
  createdate: Date;
  description: string;
  apartmentType: {
    id: string;
    name: string;
  };
}

export const filterByCity = (houses: House[], city: string) => {
  return houses.filter(
    (house) => city === "Location (any)" || house.city === city
  );
};

export const filterByDistrict = (houses: House[], district: string) => {
  return houses.filter(
    (house) => district === "districtDefault" || house.district === district
  );
};

export const filterByWard = (houses: House[], ward: string) => {
  return houses.filter(
    (house) => ward === "wardDefault" || house.ward === ward
  );
};

export const filterByPropertyType = (houses: House[], propertyType: string) => {
  return houses.filter(
    (house) =>
      propertyType === "Property type (any)" ||
      house.apartmentType.name === propertyType
  );
};

export const filterByPrice = (houses: House[], price: number) => {
   return houses.filter((house) => house.price === price);
};

export const filterByAcreage = (houses: House[], acreage: number) => {
  return houses.filter((house) => house.acreage === acreage);
};


