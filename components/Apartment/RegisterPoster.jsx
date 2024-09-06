import React, { useState, useEffect, useContext } from "react";
// import context
import { HouseContext } from "./HouseContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {createApprove} from "../../api/approvePoster/createApprovePoster";
import Link from "next/link";
import { checkApproveAccount } from "../../api/approvePoster/checkApproveAccount";
const RegisterPoster = () => {
  const {user
  } = useContext(HouseContext);

  const [isCheck,setIsCheck] = useState(false);
  const [isRegistered,setIsRegister] = useState(false);
  const [isAlreadyRegister,setIsAlreadyRegister] = useState(false);

  const handleRegisterPoster = async () => {
    const checkApproveData = await checkApproveAccount(user.id);
    if(checkApproveData){
        setTimeout(() => {
          setIsAlreadyRegister(true);
        }, 1000);
    }else{
         const approveData = {
           id: new Date().getTime().toString(),
           accountId: user.id,
           username: user.username,
           status: false,
         };
         if (approveData) {
           await createApprove(approveData)
             .then((data) => {
               console.log("Đăng ký trở thành poster thành công", data);
               setTimeout(() => {
                 setIsRegister(true);
               }, 1000);
             })
             .catch((error) => {
               console.log("Đăng ký trở thành Poster thất bại", error);
             });
         }
    }
   
  }

  return (
    <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 mb-16">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Motel Poster Terms and Conditions
        </CardTitle>
        <CardDescription>
          Please review the following terms and conditions to become a
          registered motel poster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Eligibility</h2>
            <p className="text-muted-foreground">
              To become a registered motel poster, you must be at least 18 years
              of age and have a valid government-issued ID.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Posting Guidelines</h2>
            <p className="text-muted-foreground">
              All motel postings must accurately represent the available rooms,
              amenities, and pricing. Misleading or false information is
              strictly prohibited.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              3. Pricing and Commissions
            </h2>
            <p className="text-muted-foreground">
              Registered posters will receive a 20% commission on all bookings
              made through their postings. Motel owners reserve the right to
              adjust pricing at any time.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              4. Availability and Booking
            </h2>
            <p className="text-muted-foreground">
              Posters must keep their availability information up-to-date.
              Failure to do so may result in penalties or suspension from the
              program.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              5. Content and Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              Posters are responsible for ensuring they have the rights to use
              any images, text, or other content in their postings. Unauthorized
              use of copyrighted material is prohibited.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              6. Termination and Suspension
            </h2>
            <p className="text-muted-foreground">
              The company reserves the right to terminate or suspend a poster's
              account for any reason, including but not limited to, violation of
              these terms, fraudulent activity, or poor customer service.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">7. Indemnification</h2>
            <p className="text-muted-foreground">
              Posters agree to indemnify and hold the company harmless from any
              claims, damages, or expenses arising from their use of the
              platform or violation of these terms.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms-agree"
              checked={isCheck}
              onCheckedChange={() => setIsCheck(!isCheck)}
            />
            <Label htmlFor="terms-agree">
              I have read and agree to the terms and conditions.
            </Label>
          </div>
          <Button
            type="button"
            className="mx-8"
            onClick={handleRegisterPoster}
            disabled={!isCheck}
          >
            Register as a Poster
          </Button>
        </div>
      </CardFooter>
      {isRegistered && (
        <Dialog defaultOpen>
          <DialogContent>
            <Card className="w-full max-w-md mx-auto border-none">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <CircleCheckIcon className="text-green-500 w-12 h-12" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    Register Poster SuccessFully
                  </h2>
                  <p className="text-muted-foreground">
                    Waiting for response from admin to be a Poster
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Go to home page
                </Link>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
      {isAlreadyRegister && (
        <Dialog defaultOpen>
          <DialogContent>
            <Card className="w-full max-w-md mx-auto border-none">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <CircleErrorIcon className="text-red-500 w-12 h-12" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    Already Register Poster
                  </h2>
                  <p className="text-muted-foreground">
                    Waiting for response from admin to be a Poster
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Go to home page
                </Link>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default RegisterPoster;

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

