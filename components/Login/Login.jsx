import React, {useState,useEffect,useContext,useRef} from "react";
import { useRouter } from "next/router";
import { HouseContext } from "../../components/Apartment/HouseContext";
import {getWallet} from "../../api/wallet/getWallet";
import { signIn } from "next-auth/react";
import {getMessageUsers} from "../../api/messages/getMessageUser";

const Login = () => {
  const router = useRouter(); // Initialize useRouter
  const { user, setUser, wallet, setWallet,message,setMessage } = useContext(HouseContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    router.push("/register");
  };

  const handleForgotpassword = () => {
    router.push("/forgotpass");
  };

  // const doSocialLoginByGoogle = () => {
  //   console.log("google");
  // };

  // const doSocialLoginByGithub = () => {
  //   console.log("github");
  // }

  const handleLogin = async () => {
    setError("");
    setUser("");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        console.log("IDDDDD" +data.user.id)
        const mess = await getMessageUsers(data.user.id);
        if(mess){
          setMessage(mess);
          console.log("MESSAGE:", mess);
        }
        const walletData = await getWallet(data.user.id);
        if(walletData){
          setWallet(walletData);
        }
        document.cookie = `session=${data.session}; expires=${new Date(
          data.expires
        ).toUTCString()}; path=/`;
        router.push("/");
      } else {
        setError("Incorrect email or password.");
      }
    } else {
      console.error("Login failed");
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="h-auto mb-12">
      <div className="w-full flex items-center justify-center">
        <div className=" w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
          <h1 className="text-5xl font-semibold">Welcome Back</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Welcome back! Please enter you details.
          </p>
          <div className="mt-8">
            <div className="flex flex-col">
              <label className="text-lg font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-lg font-medium">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
                type={"password"}
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <div className="mt-8 flex justify-between items-center">
              <div>
                <input type="checkbox" id="remember" />
                <label className="ml-2 font-medium text-base" for="remember">
                  Remember for 30 days
                </label>
              </div>
              <button
                className="font-medium text-base text-violet-500"
                onClick={handleForgotpassword}
              >
                Forgot password
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-y-4">
              <button
                onClick={handleLogin}
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  
                ease-in-out transform py-4 bg-violet-700 rounded-xl text-white font-bold text-lg"
              >
                Sign in
              </button>
              <div className="flex">
                <button
                  className="flex items-center w-[50%] mr-2 justify-center 
                gap-2 active:scale-[.98] active:duration-75 transition-all 
                hover:scale-[1.01]  ease-in-out transform py-4  rounded-xl
                 text-gray-700 font-semibold text-lg border-2 border-gray-100 "
                  onClick={() => signIn()}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                      fill="#34A853"
                    />
                    <path
                      d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                      fill="#4A90E2"
                    />
                    <path
                      d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                      fill="#FBBC05"
                    />
                  </svg>
                  Sign in with Google
                </button>
                <button
                  className="flex items-center justify-center w-[50%] ml-2 
                gap-2 active:scale-[.98] active:duration-75 transition-all 
                hover:scale-[1.01] ease-in-out transform py-4 rounded-xl 
                text-gray-700 font-semibold text-lg border-2 border-gray-100"
                  // onClick={doSocialLoginByGithub}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 0.297363C5.371 0.297363 0 5.66836 0 12.2974C0 17.63 3.438 22.1445 8.207 23.7754C8.805 23.8696 9.023 23.5406 9.023 23.2556C9.023 23.0056 9.015 22.2556 9.01 21.2974C5.672 21.9284 4.968 19.51 4.968 19.51C4.47 18.3234 3.797 18.0074 3.797 18.0074C2.828 17.4974 3.873 17.5144 3.873 17.5144C4.953 17.5844 5.497 18.6024 5.497 18.6024C6.454 20.2964 8.068 19.79 8.692 19.51C8.792 18.8584 9.068 18.4154 9.372 18.1254C6.832 17.8304 4.118 16.76 4.118 11.9474C4.118 10.5734 4.585 9.44236 5.327 8.56436C5.207 8.26736 4.792 6.99736 5.437 5.36436C5.437 5.36436 6.46 5.03636 8.999 6.70836C9.938 6.42536 10.952 6.29736 11.967 6.29736C12.982 6.29736 13.997 6.42536 14.936 6.70836C17.475 5.03636 18.498 5.36436 18.498 5.36436C19.143 6.99736 18.728 8.26736 18.608 8.56436C19.35 9.44236 19.817 10.5734 19.817 11.9474C19.817 16.77 17.1 17.83 14.557 18.1214C14.944 18.4634 15.289 19.1224 15.289 20.0514C15.289 21.2734 15.276 22.4284 15.276 23.2554C15.276 23.5404 15.493 23.8714 16.093 23.7754C20.861 22.1444 24.299 17.63 24.299 12.2974C24.299 5.66836 18.928 0.297363 12.299 0.297363H12Z"
                      fill="black"
                    />
                  </svg>
                  Sign in with Github
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <p className="font-medium text-base">Don't have an account?</p>
              <button
                onClick={handleSignup}
                className="ml-2 font-medium text-base text-violet-700"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
