import React, { useState } from "react";
import { useRouter } from "next/router";
import { register } from "../../api/users/createUser";
import { getRoleUser } from "../../api/role/getRoleUser";
import {createWallet} from "../../api/wallet/createWallet";
import {getUsername} from "../../api/users/getUsers";
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
import { Button } from "@/components/ui/button";
const Register = () => {
  const router = useRouter(); // Initialize useRouter
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleLogin = () => {
    router.push("/login");
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const isValidLength = password.length >= 6;
    return hasUpperCase && isValidLength;
  };

  const handleRegister = async () => {
    setError(""); // Clear previous errors

    if (!validatePassword(password)) {
      setError("Mật khẩu phải ít nhất 6 chữ và có ít nhất 1 chữ viết hoa.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    const usernameData = await getUsername(email);
    if (usernameData) {
      setError("Email đã tồn tại.");
      return;
    }

    const role = await getRoleUser();
        const userData = {
          username: email,
          password: password,
          firstname: "null",
          lastname: "null",
          phone: "null",
          email: email,
          gender: "null",
          roles: [role],
          enabled: false,
          roleString: "USER",
        };
        const now = new Date();
        const timestamp = now.getTime().toString();
        console.log(userData);
        register(userData)
          .then((data) => {
            console.log(data);
            const walletData = {
              id: timestamp,
              balance: 0,
              password_payment: "",
              account: data, // Sử dụng dữ liệu trả về từ register
              paymentInfo: [],
              walletTransaction: [],
            };
            createWallet(walletData)
              .then((data) => {
                console.log("Tạo ví thành công", data);
              })
              .catch((error) => {
                console.log("Tạo ví thất bại", error);
              });
            setTimeout(() => {
              setCreateSuccess(true);
            }, 1000);
          })
          .catch((error) => {
            console.error("Tạo tài khoản thất bại:", error.message);
          });
  };

  return (
    <main>
      <div className="flex w-full h-auto mb-10">
        <div className="w-full flex items-center justify-center">
          <div className=" w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
            <h1 className="text-5xl font-semibold">Sign up</h1>
            <p className="font-medium text-lg text-gray-500 mt-4">
              Welcome back! Please enter you details.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-2 mr-4">
                <label className="text-lg font-medium">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Nhập tài khoản"
                />
              </div>
              <div className="flex flex-col mt-4 col-span-2">
                <label className="text-lg font-medium">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Nhập mật khẩu"
                  type={"password"}
                />
              </div>
              <div className="flex flex-col mt-4 col-span-2">
                <label className="text-lg font-medium">Confirm Password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Nhập lại mật khẩu"
                  type={"password"}
                />
                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
              </div>

              <div className="mt-4 flex flex-col gap-y-4">
                <button
                  onClick={() => handleRegister()}
                  className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
                >
                  Sign up
                </button>
              </div>
              <div className="mt-8 flex justify-center items-center">
                <p className="font-medium text-base">Đã có tài khoản</p>
                <button
                  onClick={() => handleLogin()}
                  className="ml-2 font-medium text-base text-violet-500"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="hidden relative w-1/2 h-full lg:flex items-center justify-center bg-gray-200">
                    <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 animate-spin" />
                    <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
                </div> */}
      </div>
      {createSuccess && (
        <Dialog defaultOpen>
          <DialogContent>
            <Card className="w-full max-w-md mx-auto border-none">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <CircleCheckIcon className="text-green-500 w-12 h-12" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    Please Confirm Account
                  </h2>
                  <p className="text-muted-foreground">
                    We already send you a link to verify your account
                  </p>
                </div>
                <Button
                  className="inline-flex h-10 items-center justify-center 
                rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground 
                shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 
                focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setCreateSuccess(!createSuccess)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default Register;

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