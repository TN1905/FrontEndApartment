import React, { useState, useEffect, useContext } from "react";
import { HouseContext } from "../../Apartment/HouseContext";
import {checkPass} from "../../../api/users/checkPass";
import { changePass } from "../../../api/users/changePass";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Button } from "@/components/ui/button";

const ChangePass = () => {
  const {user, setUser} = useContext(HouseContext);
  const [password, setPassword] = useState('');
  const [newPass,setNewPass] = useState('');
  const [confirmPass,setConfirmPass] = useState('');
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const validateForm = () => {
    let formErrors = {};
    if (!password) formErrors.password = "Current password is required.";
    if (!newPass) {
      formErrors.newPass = "New password is required.";
    } else if (newPass.length < 6) {
      formErrors.newPass = "New password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(newPass)) {
      formErrors.newPass =
        "New password must contain at least one uppercase letter.";
    }
    if (!confirmPass) {
      formErrors.confirmPass = "Please confirm your new password.";
    } else if (newPass !== confirmPass) {
      formErrors.confirmPass = "New passwords do not match.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleUpdatePass = async () => {
    if (!validateForm()) return;
    let formErrors = {};
    const check = await checkPass(user.email,password);
    if(check){
      if(newPass === confirmPass){
        const updatedPass = {
          ...user,
          password: newPass,
        };
        try {
          const response = await changePass(user.id, updatedPass);
          if (response) {
            setUser(updatedPass);
            setTimeout(() => {
              setUpdateSuccess(true);
            }, 1000);
          } else {
            alert("Cập nhật password thất bại!");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("Đã xảy ra lỗi khi cập nhật thông tin!");
        }
      }else{
        formErrors.password = "New password is not correct.";
      }
    }else{
      formErrors.password = "Current password is not correct.";
      setErrors(formErrors);
      return Object.keys(formErrors).length === 0;
    }
  }

  return (
    <div className=" w-full h-[90vh] items-center justify-center">
      <Card className="w-full mx-auto mt-12">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password for better security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              {errors.newPass && (
                <p className="text-sm text-red-500">{errors.newPass}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              {errors.confirmPass && (
                <p className="text-sm text-red-500">{errors.confirmPass}</p>
              )}
            </div>
            <Button type="button" className="w-full" onClick={handleUpdatePass}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
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

export default ChangePass;

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