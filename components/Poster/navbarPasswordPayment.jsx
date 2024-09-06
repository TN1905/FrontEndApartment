import React, { useContext, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {createPasswordPayment} from "../../api/wallet/createPasswordPayment";
import { HouseContext } from "../Apartment/HouseContext";
function NavbarPasswordPayment() {
  const [passwordPayment, setPasswordPayment] = useState("");
  const [confirmPasswordPayment, setConfirmPasswordPayment] = useState("");
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);
  const {wallet} = useContext(HouseContext);
  const handlePasswordChange = (value) => {
    setPasswordPayment(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPasswordPayment(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordPayment === confirmPasswordPayment) {
      console.log("Passwords match!");
      await createPasswordPayment(wallet.id,passwordPayment)
      .catch((data) => {
        console.log("update password successfully",data);
      }).then((error) => {
        console.log("update password payment failed",error);
      });
    } else {
      console.log("Passwords do not match!");
      setIsPasswordMatched(false);
      console.log("update password payment failed", error);
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
            <LockIcon className="w-5 h-5" />
            Password Payment
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <LockIcon className="size-12 text-primary" />
            <p className="text-lg font-medium">Enter your password</p>
          </div>
          <form className="space-y-4 px-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
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
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <InputOTP maxLength={6} onChange={handleConfirmPasswordChange}>
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
            {!isPasswordMatched && (
              <p className="text-red-500">Passwords do not match!</p>
            )}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!isPasswordMatched}
              >
                Confirm
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

export default NavbarPasswordPayment;

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
