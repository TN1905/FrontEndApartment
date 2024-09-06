import React, {useState, useEffect, createContext} from 'react';
import { getListApartment } from "../../api/apartments/getListApartment";

//create context
export const HouseContext = createContext();

const HouseContextProvider = ({children}) => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [districtValue, setDistrictValue] = useState("districtDefault");
  const [wardValue, setWardValue] = useState("wardDefault");
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [priceFilter, setPriceFilter] = useState(1000000);
  const [acreageFilter, setAcreageFilter] = useState(10);
  const [apartTypeId, setApartTypeId] = useState("");
  const [wardName, setWardName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numbers,setNumbers] = useState([]);
  const [records,setRecords] = useState([]); 
  const [searchContent, setSearchContent] = useState("");
  const [editApartment, setEditApartment] = useState();
  const [isEdit, setIsEdit] = useState();
  const [wallet,setWallet] = useState("");
  const [depositeData,setDepositeData] = useState();
  const [rentApartmentDataMOMO,setRentApartmentDataMOMO] = useState();
  const [rentApartmentDataVNPAY, setRentApartmentDataVNPAY] = useState();
  const [message,setMessage] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const recordsPerPage = 20;

  const getApartmentList = async () => {
    try {
      const housesData = await getListApartment();
      console.log(housesData);

      // Lọc danh sách chỉ chứa các phần tử có trạng thái ACTIVE
      const activeHouses = housesData.filter(
        (data) => data.status === "ACTIVE"
      );

      // Cập nhật state với danh sách đã lọc
      setHouses(activeHouses);
      setFilteredHouses(activeHouses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách căn hộ:", error);
    }
    
  };

  useEffect(() => {
    getApartmentList();
  }, []);
  

  // Previous Page
  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Change Page
  const changePage = (id) => {
    setCurrentPage(id);
  };

  // Next Page
  const nextPage = () => {
    if (currentPage !== (numbers.length)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginateHouses = () => {
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    console.log(filteredHouses, "filterHouses");
    const records = filteredHouses.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredHouses.length / recordsPerPage);
    const numbers = [...Array(npage).keys()].map((i) => i + 1);
    setNumbers(numbers);
    setRecords(records);
  };

  useEffect(() => {
    paginateHouses();
  }, [filteredHouses, currentPage]);
// filtered = filtered.filter((data) => data.status === "ACTIVE");
  const filter = () => {
    let filtered = houses;
    
    if (cityName && cityName !== "") {
      filtered = filtered.filter((house) => house.city === cityName);
    }
    if (
      districtName &&
      districtName !== "" &&
      districtName !== "districtDefault"
    ) {
      filtered = filtered.filter((house) => house.district === districtName);
    }
    if (wardName && wardName !== "" && wardName !== "wardDefault") {
      filtered = filtered.filter((house) => house.ward === wardName);
    }
    if(priceFilter >= 2000000){
      filtered = filtered.filter((house) => house.price >= 1000000 && house.price <= priceFilter);
    }
    if (searchContent && searchContent !== "") {
      filtered = filtered.filter((house) =>
        house.content.toLowerCase().includes(searchContent.toLowerCase())
      );
    }
    if (acreageFilter >= 20) {
      filtered = filtered.filter(
        (house) => house.acreage >= 10 && house.acreage <= acreageFilter
      );
    }
    if (apartTypeId) {
      filtered = filtered.filter(
        (house) => house.apartmentType.id === apartTypeId
      );
    }
    setFilteredHouses(filtered);
  };

  // const filter = () => {
  //   if (cityName) {
  //     const houseData = houses.filter((house) => {
  //       console.log(cityName, "name");
  //        console.log(house.city, "name1");
  //       return house.city === cityName;
  //     });
  //     setHouses(houseData);
  //     console.log(houseData,"????????");
  //     paginateHouses();
  //     console.log("?SAda");
  //   }
  // };



  useEffect(() => {
    const getSession = async () => {
      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="));
      if (sessionCookie) {
        const session = sessionCookie.split("=")[1];
        try {
          // Gửi yêu cầu tới API để kiểm tra session
          const response = await fetch("/api/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Cập nhật thông tin người dùng
              console.log(data.user, "User data");
              setUser(data.user);
            } else {
              console.error("Session validation failed");
            }
          } else {
            console.error("Session request failed");
          }
        } catch (error) {
          console.error("Error fetching session:", error);
        }
      }
    };
    getSession();
  }, [setUser]);

  return (
    <HouseContext.Provider
      value={{
        houses,
        setHouses,
        filteredHouses,
        loading,
        user,
        setUser,
        district,
        ward,
        districtValue,
        wardValue,
        cityName,
        districtName,
        wardName,
        currentPage,
        setDistrict,
        setWard,
        setDistrictValue,
        setWardValue,
        setCityName,
        setDistrictName,
        setWardName,
        setCurrentPage,
        filter,
        paginateHouses,
        prePage,
        nextPage,
        changePage,
        numbers,
        records,
        priceFilter,
        setPriceFilter,
        acreageFilter,
        setAcreageFilter,
        apartTypeId,
        setApartTypeId,
        searchContent,
        setSearchContent,
        editApartment,
        setEditApartment,
        isEdit,
        setIsEdit,
        wallet,
        setWallet,
        depositeData,
        setDepositeData,
        rentApartmentDataMOMO,
        setRentApartmentDataMOMO,
        rentApartmentDataVNPAY,
        setRentApartmentDataVNPAY,
        message,
        setMessage,
        selectedRental,
        setSelectedRental
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export default HouseContextProvider;
