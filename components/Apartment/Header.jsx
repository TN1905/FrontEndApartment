import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { HouseContext } from "./HouseContext";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "../../hooks/useTranslation";
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
import { useRouter } from "next/router";
const Header = () => {
  const { user, setUser, message } = useContext(HouseContext);
  const [timeAgo, setTimeAgo] = useState("");
  const [role, setRole] = useState();
  const { t } = useTranslation();
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("session");
    setUser(null);
  };

  function TimeAgo({ timestamp }) {
    console.log("Original timestamp:", timestamp);

    // Ép kiểu timestamp thành số nếu cần
    if (typeof timestamp !== "number") {
      timestamp = Number(timestamp);
    }

    console.log("Converted timestamp:", timestamp);

    // Kiểm tra nếu timestamp không hợp lệ
    if (isNaN(timestamp)) {
      return <span>Invalid timestamp</span>;
    }

    const now = Date.now(); // Lấy thời gian hiện tại (milliseconds)
    const seconds = Math.floor((now - timestamp) / 1000); // Tính thời gian trôi qua tính theo giây

    console.log("Seconds ago:", seconds);

    let timeAgo = "";
    if (seconds < 60) {
      timeAgo = `${seconds}s ago`; // Nếu dưới 60 giây
    } else if (seconds < 3600) {
      timeAgo = `${Math.floor(seconds / 60)}m ago`; // Nếu dưới 60 phút
    } else if (seconds < 86400) {
      timeAgo = `${Math.floor(seconds / 3600)}h ago`; // Nếu dưới 24 giờ
    } else {
      timeAgo = `${Math.floor(seconds / 86400)}d ago`; // Nếu dưới 30 ngày
    }

    console.log("Time ago:", timeAgo);

    return <span>{timeAgo}</span>;
  }

  // useEffect(() => {

  // },[])



  useEffect(() => {
    if (user && user.roles) {
      const roleData = user.roles.map((role) => role.name);
      if (roleData.includes("ADMIN")) {
        setRole("ADMIN");
      } else if (roleData.includes("POSTER")) {
        setRole("POSTER");
      } else {
        setRole("USER");
      }
    }
  }, [user]);

  const changeLanguage = (lng) => {
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  const handlePoster = () => {
    
  }

  return (
    <header className="py-6 mb-12 border-b">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <img src="/assets/img/logo.svg" alt="Logo" className="h-12" />
        </div>

        {/* Navigation */}
        <ul className="flex justify-around space-x-4">
          <li className="cursor-pointer hover:text-violet-900 transition">
            <Link href="/">
              <span className="text-base font-medium">{t("home")}</span>
            </Link>
          </li>
          <li className="cursor-pointer hover:text-violet-900 transition">
            <Link href="/apartments">
              <span className="text-base font-medium">
                {t("list_apartment")}
              </span>
            </Link>
          </li>
          <li className="cursor-pointer hover:text-violet-900 transition">
            <Link href="/contact">
              <span className="text-base font-medium">{t("contact")}</span>
            </Link>
          </li>
          <li className="cursor-pointer hover:text-violet-900 transition">
            <Link href="/favorites">
              <span className="text-base font-medium">{t("favorite")}</span>
            </Link>
          </li>
        </ul>

        {/* User Menu */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeLanguage("en")}
              className="text-base font-medium"
            >
              {t("english")}
            </button>
            <button
              onClick={() => changeLanguage("vi")}
              className="text-base font-medium"
            >
              {t("vietnam")}
            </button>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <BellIcon className="h-6 w-6" />
                    <div className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {message.length}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[400px] p-4">
                  <DropdownMenuLabel className="mb-2 text-lg font-medium">
                    Notifications
                  </DropdownMenuLabel>
                  <div className="grid gap-4">
                    {message.map((data, index) => (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <MailOpenIcon className="h-5 w-5" />
                        </div>

                        <div className="space-y-1">
                          <Link href="/mintnft">
                            <p className="text-sm font-medium">{data.title}</p>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {data.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <TimeAgo timestamp={Number(data.createtime)} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">
                    {user.username}
                  </div>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 right-0">
                {role === "USER" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/profile" prefetch={false}>
                        <span>{t("profile")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/wallet" prefetch={false}>
                        <span>{t("wallet")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/registerposter" prefetch={false}>
                        <span>{t("register_poster")}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {role === "POSTER" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/profile" prefetch={false}>
                        <span>{t("profile")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/upload" prefetch={false}>
                        <span>{t("upload")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/apartment" prefetch={false}>
                        <span>{t("apartment_manage")}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {role === "ADMIN" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/admin/dashboard" prefetch={false}>
                        <span>{t("admin_manage")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/admin/transaction" prefetch={false}>
                        <span>{t("transaction")}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button variant="outline" onClick={handleLogout}>
                    {t("logout")}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-violet-800 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-violet-700 transition">
                  {t("login")}
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-violet-800 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-violet-700 transition">
                  {t("signup")}
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;



function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function BellIcon(props) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CalendarCheckIcon(props) {
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
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function MailOpenIcon(props) {
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
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
    </svg>
  );
}

function ReplaceIcon(props) {
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
      <path d="M14 4c0-1.1.9-2 2-2" />
      <path d="M20 2c1.1 0 2 .9 2 2" />
      <path d="M22 8c0 1.1-.9 2-2 2" />
      <path d="M16 10c-1.1 0-2-.9-2-2" />
      <path d="m3 7 3 3 3-3" />
      <path d="M6 10V5c0-1.7 1.3-3 3-3h1" />
      <rect width="8" height="8" x="2" y="14" rx="2" />
    </svg>
  );
}
