import React, {useState, useEffect} from "react";
import MainLayout from "../layouts/MainLayout";
import Register from "../components/Login/Register";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { confirmTokenRegister } from "../api/token/registerToken";
import {getToken} from "../api/token/getToken";
const ConfirmRegister = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    console.log("Router Query:", router.query); // Log toàn bộ query params

    const fetchData = async () => {
      try {
        const token = router.query.token;
        if (token) {
          console.log("Token:", token);
          const data = await confirmTokenRegister(token);
          console.log("Xác nhận token thành công", data);
        } else {
          console.log("Không tìm thấy token trong query params");
        }
      } catch (error) {
        console.error("Xác nhận token thất bại", error);
      }
    };

    fetchData();
  }, [router.isReady, router.query]);
  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      <MainLayout>
        <Card className="w-full max-w-md mx-auto mb-44">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <CircleCheckIcon className="text-green-500 w-12 h-12" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Account Enabled</h2>
              <p className="text-muted-foreground">
                Congratulations! Your account has been successfully enabled.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
      </MainLayout>
    </div>
  );
};

export default ConfirmRegister;

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
