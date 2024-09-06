import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {checkPasswordPayment} from "../../api/wallet/checkPasswordPayment";
import { createPasswordPayment } from "../../api/wallet/createPasswordPayment";
import { HouseContext } from "../Apartment/HouseContext";
function NavbarResetPassword() {
  const [passwordPayment,setPasswordPayment] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmNewPassword,setConfirmNewPassword] = useState("");
  const {wallet} = useContext(HouseContext);

  const handlePasswordChange = (value) => {
    setPasswordPayment(value);
  };

  const handleNewPassword = (value) => {
    setNewPassword(value);
  };

  const handleConfirmNewPassword = (value) => {
    setConfirmNewPassword(value);
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
    const checkResetPass = await checkPasswordPayment(
      wallet.id,
      passwordPayment
    );
    if(checkResetPass){
      if (newPassword === confirmNewPassword) {
        console.log("Passwords match!");
        await createPasswordPayment(wallet.id, passwordPayment)
          .catch((data) => {
            console.log("update password successfully", data);
          })
          .then((error) => {
            console.log("update password payment failed", error);
          });
      } else {
        console.log("Passwords do not match!");
        setIsPasswordMatched(false);
        console.log("update password payment failed", error);
      }
    }else{
      console.log("old pass word wrong");
    }
   };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 w-full"
          >
            <KeyIcon className="w-5 h-5" />
            Reset Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <LockIcon className="size-12 text-primary" />
            <p className="text-lg font-medium">Reset your password</p>
          </div>
          <form className="space-y-4 px-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="password">Enter Old Password</Label>
              <InputOTP maxLength={6} onChange={handlePasswordChange}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div>
              <Label htmlFor="newPassword">Enter New Password</Label>
              <InputOTP maxLength={6} onChange={handleNewPassword}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <InputOTP maxLength={6} onChange={handleConfirmNewPassword}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
              <div>
                <Button variant="outline" type="button" className="w-full">
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NavbarResetPassword;

function LockIcon(props) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function KeyIcon(props) {
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
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  );
}
