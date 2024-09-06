import React, { useState, useEffect,useContext } from "react";
import { HouseContext } from "../../Apartment/HouseContext";
import { getWallet } from "../../../api/wallet/getWallet";
import { updateUser} from "../../../api/users/updateUser";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {getUsername} from "../../../api/users/getUsers";
const Profile = () => {
  const { user, setUser } = useContext(HouseContext);
  const [firstName, setFirstName] = useState(user.firstname);
  const [lastName, setLastName] = useState(user.lastname);
  const [gender, setGender] = useState(user.gender);
  const [phone, setPhone] = useState(user.phone);
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  useEffect(() => {
    const initiate = async () => {
      const userData = await getUsername(user.username);
      if(userData){
        setFirstName(userData.firstname);
        setLastName(userData.lastname);
        setPhone(userData.phone);
        setGender(userData.gender);

      }
    }
    initiate();
  }, []);

  const validateForm = () => {
    let formErrors = {};
    if (!firstName.trim()) formErrors.firstName = "First Name is required.";
    if (!lastName.trim()) formErrors.lastName = "Last Name is required.";
    if (!gender) formErrors.gender = "Gender is required.";
    if (!phone.trim()) formErrors.phone = "Phone Number is required.";
    // Additional phone number validation can be added here
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
     if (!validateForm()) return;
    const updatedUser = {
      ...user,
      firstname: firstName,
      lastname: lastName,
      gender: gender,
      phone: phone,
    };

    try {
      const response = await updateUser(user.id, updatedUser);
      if (response) {
        setUser(updatedUser);
        setTimeout(() => {
          setUpdateSuccess(true);
        }, 1000);
      } else {
        alert("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin!");
    }
  };

  return (
    <div className=" w-full h-[90vh] items-center justify-center">
      <main id="main" className="main">
        <Card className="w-full mt-12">
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>Manage your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex items-center gap-4"
              >
                <Label
                  htmlFor="male"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioGroupItem id="male" value="male" />
                  Male
                </Label>
                <Label
                  htmlFor="female"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioGroupItem id="female" value="female" />
                  Female
                </Label>
                <Label
                  htmlFor="other"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioGroupItem id="other" value="other" />
                  Other
                </Label>
              </RadioGroup>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 555-5555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handleUpdateProfile}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="py-5 text-sm transition-all duration-300 border-t border-[#cddfff] text-center">
        <div className="items-center text-[#012970]">
          &copy; Copyrights
          <strong>
            <span> Poster</span>
          </strong>
          . All Rights Reserved
        </div>
      </footer>
      {updateSuccess && (
        <Dialog defaultOpen>
          <DialogContent>
            <Card className="w-full max-w-md mx-auto border-none">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <CircleCheckIcon className="text-green-500 w-12 h-12" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    Update Apartment Successfully
                  </h2>
                  <p className="text-muted-foreground">
                    Now this apartment already updated
                  </p>
                </div>
                <Button
                  className="inline-flex h-10 items-center justify-center 
                rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground 
                shadow transition-colors hover:bg-primary/90 focus-visible:outline-none 
                focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setUpdateSuccess(!updateSuccess)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Profile;

function CircleCheckIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CircleErrorIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}