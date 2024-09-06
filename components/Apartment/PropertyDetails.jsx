import React, {useState, useEffect} from 'react';
// import icons
import {BiBed, BiBath, BiArea} from "react-icons/bi";
import { useRouter } from "next/router";
import {getApartmentOne} from "../../api/apartments/getApartmentOne";
import {getApartmentImage} from "../../api/uploadImage/getApartmentImage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Comments from "../Apartment/Comments";
import { useTranslation } from "../../hooks/useTranslation";
const PropertyDetails = () => {
  const [apartmentDetail, setApartmentDetail] = useState({});
  const [imageDetail, setImageDetail] = useState([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeImg, setActiveImage] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();


   useEffect(() => {
     if (id) {
       getApartmentDetail();
       getImageApartment();
     }
   }, [id]);

   const getApartmentDetail = async () => {
     try {
       const apartData = await getApartmentOne(id);
       console.log(apartData);
       setApartmentDetail(apartData);
     } catch (error) {
       console.error("Error fetching apartment detail:", error);
     }
   };

   const getImageApartment = async () => {
     try {
       const imageData = await getApartmentImage(id);
       console.log(imageData);
       setImageDetail(imageData);
       if (imageData.length > 0) {
         setActiveImage(imageData[0].imageData);
       }
     } catch (error) {
       console.error("Error fetching apartment images:", error);
     }
   };

   
  const formatDescription = (description) => {
    return description
      ?.split(/(?<=[:.])\s/)
      .map((sentence, index) => <p key={index}>{sentence.trim()}</p>);
  };

  

  return (
    <div>
      <div className="flex flex-col justify-between lg:flex-row gap-16 mb-20">
        <div className="flex flex-col gap-6 lg:w-2/4">
          <img
            src={activeImg}
            alt=""
            className="w-full h-[520px] aspect-square object-cover rounded-xl"
            onClick={() => console.log(imageDetail)}
          />
          <div className="flex flex-row justify-between h-24">
            {imageDetail.map((data, index) => (
              <img
                key={index}
                src={data.imageData}
                alt=""
                className={`w-[150px] h-[150px] rounded-md cursor-pointer ${
                  activeImgIndex === index ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => {
                  setActiveImage(data.imageData);
                  setActiveImgIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-2/4">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">{apartmentDetail.content}</h1>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <DollarSignIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">{t("price")}</div>
                <div className="text-2xl font-bold">
                  {apartmentDetail.price?.toLocaleString("vi-VN")} VNĐ/
                  {t("month")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RulerIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">{t("acreage")}</div>
                <div>{apartmentDetail.acreage}/m2</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPinIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">{t("address")}</div>
                <div>
                  {apartmentDetail.address}, {apartmentDetail.ward},{" "}
                  {apartmentDetail.district}, {apartmentDetail.city}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">{t("created")}</div>
                <div>{apartmentDetail.createdate}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <HomeIcon className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">
                  {t("apartment_type")}: {apartmentDetail.apartmentType?.name}
                </div>
              </div>
            </div>
            <div className="prose">
              <h3>{t("description")}</h3>
              {formatDescription(apartmentDetail.description)}
            </div>
            <Link
              className="bg-black text-white px-6 py-3
            rounded-md hover:bg-primary/90 focus:outline-none 
            focus:ring-2 focus:ring-primary focus:ring-offset-2 items-center
            text-center mt-5"
              href={`/rent/[id]`}
              as={`/rent/${apartmentDetail.id}`}
            >
              {t("rent_now")}
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full mb-20 mx-auto space-y-6">
        <Comments id={`detail-${id}`} />
      </div>
      {/* <div className="w-full mb-20 mx-auto space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h2 className="text-2xl font-bold">Comments</h2>
            <p className="text-muted-foreground">
              Share your thoughts about this apartment listing.
            </p>
          </div>
          <div className="grid gap-4">
            <Textarea
              placeholder="Write your comment here..."
              className="p-4 rounded-md border border-muted focus:border-primary focus:ring-primary"
              rows={4}
            />
            <Button className="justify-self-end">Submit</Button>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">John Doe</div>
                  <div className="text-xs text-muted-foreground">
                    2 days ago
                  </div>
                </div>
                <p className="text-muted-foreground">
                  This apartment looks amazing! The location is perfect and the
                  amenities seem top-notch. I can't wait to schedule a tour.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Jane Appleseed</div>
                  <div className="text-xs text-muted-foreground">
                    1 week ago
                  </div>
                </div>
                <p className="text-muted-foreground">
                  I'm really impressed with the attention to detail in this
                  listing. The photos and description make it look like a
                  fantastic place to live.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="ghost" size="sm">
              Load more comments
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PropertyDetails;

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

function DollarSignIcon(props) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MapPinIcon(props) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function RulerIcon(props) {
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
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </svg>
  );
}
