import React, { useState, useEffect,useContext } from "react";
import { Button } from "@/components/ui/button";
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
import {HouseContext} from "../Apartment/HouseContext";
import {addPaymentMethod} from "../../api/payment_info/postPaymentInfo";
import {getWallet} from "../../api/wallet/getWallet";

function NavbarAddPaymentMethod() {
  const [paymentMethod,setPaymentMethod] = useState('momo');
  const [numberPayment,setNumberPayment] = useState('');
  const {user, setUser} = useContext(HouseContext);

  const handlePaymentMethod = async () => {
    console.log(paymentMethod);
    console.log(Date.now().toString());
    
    const walletData = await getWallet(user.id);
    if(walletData){
      const dataPayment = {
        id: Date.now().toString(),
        name: paymentMethod,
        payment_number: numberPayment,
        wallet: walletData,
      };
      await addPaymentMethod(dataPayment);
    }
  }

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 w-full"
          >
            <PlusIcon className="h-5 w-5" />
            Add Payment Method
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Select your preferred payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup
              defaultValue="momo"
              onClick={(e) => setPaymentMethod(e.target.value)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="momo"
                  id="momo"
                  name="payment"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="momo"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <WalletIcon className="mb-3 h-6 w-6" />
                  MOMO
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="vnpay"
                  id="vnpay"
                  name="payment"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="vnpay"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <WalletIcon className="mb-3 h-6 w-6" />
                  VNPAY
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="solana"
                  id="solana"
                  name="payment"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="solana"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <WalletIcon className="mb-3 h-6 w-6" />
                  SOLANA
                </Label>
              </div>
            </RadioGroup>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter name" 
              value={paymentMethod} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Number</Label>
              <Input id="number" placeholder="Enter number" onChange={(e) => {setNumberPayment(e.target.value)}} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handlePaymentMethod}>
              Save
            </Button>
            <div>
              <Button variant="outline">Cancel</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NavbarAddPaymentMethod;



function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function WalletIcon(props) {
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
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
