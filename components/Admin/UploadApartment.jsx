import React, { useState, useEffect, useRef, useContext } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { uploadImage } from "../../api/uploadImage/postImage";
import { getApartmentTypeOne } from "../../api/apartmentType/getApartmentTypeOne";
import { createApartment } from "../../api/apartments/createApartment";
import { getApartmentImage } from "../../api/uploadImage/getApartmentImage";
import { HouseContext } from "../Apartment/HouseContext";
import { deleteImage } from "../../api/uploadImage/deleteImage";
import { updateApartment } from "../../api/apartments/updateApartment";
const UploadApartment = ({ loadLocationData, apartmentTypeData }) => {
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [images, setImages] = useState([]);
  const [districtValue, setDistrictValue] = useState("districtDefault");
  const [wardValue, setWardValue] = useState("wardDefault");
  const [cityName, setCityName] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState(0);
  const [acreage, setAcreage] = useState(0);
  const [description, setDescription] = useState("");
  const { user, setUser, editApartment, setEditApartment, isEdit, setIsEdit } =
    useContext(HouseContext);
  const [apartTypeId, setApartTypeId] = useState("apartDefault");
  const [fileImage, setFileImage] = useState([]);

  useEffect(() => {
    const initiate = async () => {
      if (editApartment) {
        setContent(editApartment.content);
        setAcreage(editApartment.acreage);
        setPrice(editApartment.price);
        setDescription(editApartment.description);
        setAddress(editApartment.address);

        const cityData = loadLocationData.find(
          (data) => data.Name === editApartment.city
        );
        if (cityData) {
          setCityValue(cityData.Id);
          setCityName(cityData.Name);
          setDistrict(cityData.Districts);

          const districtData = cityData.Districts.find(
            (d) => d.Name === editApartment.district
          );
          if (districtData) {
            setDistrictValue(districtData.Id);
            setDistrictName(districtData.Name);
            setWard(districtData.Wards);

            const wardData = districtData.Wards.find(
              (w) => w.Name === editApartment.ward
            );
            if (wardData) {
              setWardValue(wardData.Id);
              setWardName(wardData.Name);
            }
          }
        }
        setApartTypeId(editApartment.apartmentType.id);
        const imageData = await getApartmentImage(editApartment.id);
        if (imageData) {
          setImages(imageData.map((data) => data.imageData));
        }
        setIsEdit(true);
      }
    };
    initiate();
  }, [editApartment, isEdit, loadLocationData]);

  const loadDistrict = (cityId) => {
    const cityData = loadLocationData.find((data) => data.Id === cityId);
    if (cityData) {
      setCityValue(cityId);
      setCityName(cityData.Name);
      setDistrict(cityData.Districts);
      setWard([]);
      setWardValue("wardDefault"); // Reset wardValue
      setDistrictValue("districtDefault"); // Reset districtValue
    }
  };

  const loadWards = (districtId) => {
    const districtData = district.find((data) => data.Id === districtId);
    if (districtData) {
      setDistrictName(districtData.Name);
      setDistrictValue(districtId);
      setWard(districtData.Wards);
      setWardValue("wardDefault"); // Reset wardValue
    }
  };

  const handleWardId = (wardId) => {
    const wardData = ward.find((w) => w.Id === wardId);
    if (wardData) {
      setWardValue(wardId);
      setWardName(wardData.Name);
    }
  };

  const handleApartTypeId = (apartTypeId) => {
    setApartTypeId(apartTypeId);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setFileImage((file) => {
      const newFileImage = [...file, ...files];
      return newFileImage.slice(0, 4);
    });
    console.log(fileImage);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => {
      const newImages = [...prevImages, ...imageUrls];
      return newImages.slice(0, 4); // Limit to 4 images
    });

    // const file = files[0];
    // const apartmentId = "APART1"; // Replace this with the actual apartment ID

    // try {
    //   const result = await uploadImage(file, apartmentId);
    //   console.log(result);

    //   const imageUrl = result.url;
    //   setImages((prevImages) => {
    //     const newImages = [...prevImages, imageUrl];
    //     return newImages.slice(0, 4); // Giới hạn tối đa 4 ảnh
    //   });
    // } catch (error) {
    //   console.error("Error uploading image:", error.message);
    // }
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFileImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdateApartment = async () => {
    const apartTypeData = await getApartmentTypeOne(apartTypeId);
    const apartmentData = {
      id: editApartment.id,
      content: content,
      ward: wardName,
      district: districtName,
      city: cityName,
      address: address,
      price: price,
      acreage: acreage,
      imagetitle: "",
      image1: "",
      image2: "",
      image3: "",
      createDate: Date.now(),
      description: description,
      apartmentType: apartTypeData,
      status: "ACTIVE",
      account: user,
    };
    const getImageData = await getApartmentImage(editApartment.id);

    if (getImageData) {
      for (let i = 0; i < getImageData.length; i++) {
        console.log(getImageData[i]);
        deleteImage(getImageData[i].id);
      }
    }
    updateApartment(editApartment.id, apartmentData)
      .then((data) => {
        console.log("Thêm nhà trọ thành công", data);
        for (let i = 0; i < fileImage.length; i++) {
          uploadImage(fileImage[i], editApartment.id)
            .then((data) => {
              console.log("Upload hình thành ảnh thành công", data);
            })
            .catch((error) => {
              console.error("Cập nhật số dư thất bại:", error.message);
            });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tạo giao dịch:", error.message);
      });
  };

  const handleCreateApartment = async () => {
    const apartTypeDate = await getApartmentTypeOne(apartTypeId);
    const now = new Date();
    const timestamp = now.getTime().toString();
    const apartmentData = {
      id: timestamp,
      content: content,
      ward: wardName,
      district: districtName,
      city: cityName,
      address: address,
      price: price,
      acreage: acreage,
      imagetitle: "",
      image1: "",
      image2: "",
      image3: "",
      createDate: Date.now(),
      description: description,
      apartmentType: apartTypeDate,
      status: "ACTIVE",
      account: user,
    };
    createApartment(apartmentData)
      .then((data) => {
        console.log("Thêm nhà trọ thành công", data);
        for (let i = 0; i < fileImage.length; i++) {
          uploadImage(fileImage[i], timestamp)
            .then((data) => {
              console.log("Upload hình thành ảnh thành công", data);
            })
            .catch((error) => {
              console.error("Cập nhật số dư thất bại:", error.message);
            });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tạo giao dịch:", error.message);
      });

    console.log(cityName);
    console.log(districtName);
    console.log(wardName);
    console.log(fileImage);
  };

  const handleNewApartment = () => {
    setEditApartment("");
    setIsEdit(false);
    setContent("");
    setAcreage("");
    setAddress("");
    setPrice("");
    setDescription("");
    setApartTypeId("apartDefault");
    setCityValue("cityDefault");
    setDistrictValue("districtDefault");
    setWardValue("wardDefault");
    setImages([]);
  };

  return (
    <main className="flex-1 p-6">
      <Card className="w-full max-w-6xl mt-5 mb-3">
        <CardHeader>
          <CardTitle>List Your Property</CardTitle>
          <CardDescription>
            Fill out the form to list your property on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter content"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Enter price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="acreage">Acreage</Label>
                <Input
                  id="acreage"
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  type="number"
                  placeholder="Enter acreage"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                placeholder="Enter description"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Select
                  onValueChange={loadDistrict}
                  value={cityValue}
                  id="city"
                  name="city"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="cityDefault">Select City</SelectItem>
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Select
                  onValueChange={loadWards}
                  value={districtValue}
                  id="district"
                  name="district"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="districtDefault">
                      Select District
                    </SelectItem>

                    {district &&
                      district.map((item) => (
                        <SelectItem key={item.Id} value={item.Id}>
                          {item.Name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ward">Ward</Label>
                <Select
                  onValueChange={handleWardId}
                  value={wardValue}
                  id="ward"
                  name="ward"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="wardDefault">Select Ward</SelectItem>
                    {ward &&
                      ward.map((item) => (
                        <SelectItem key={item.Id} value={item.Id}>
                          {item.Name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apartment-type">Apartment Type</Label>
                <Select
                  id="apartment-type"
                  value={apartTypeId}
                  onValueChange={(value) => handleApartTypeId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select apartment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="apartDefault">
                      Select Apartment Type
                    </SelectItem>
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
            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <div className="grid grid-cols-4 gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-md object-cover w-full aspect-square"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 bg-background/80 hover:bg-background"
                      onClick={() => handleImageRemove(index)}
                      type="button"
                    >
                      <XIcon className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={() => {
              handleNewApartment();
            }}
            className="mx-2"
          >
            New Apartment
          </Button>
          <Button
            type="submit"
            onClick={() => {
              handleUpdateApartment();
            }}
            className="mx-2"
            disabled={!isEdit}
          >
            Update Apartment
          </Button>
          <Button
            type="submit"
            onClick={() => {
              handleCreateApartment();
            }}
            className="mx-2"
            disabled={isEdit}
          >
            Create Apartment
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default UploadApartment;

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
