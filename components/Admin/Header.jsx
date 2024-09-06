import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { HouseContext } from "../Apartment/HouseContext";
import { getWallet } from "../../api/wallet/getWallet";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  const { user, setUser, wallet, setWallet } = useContext(HouseContext);
  const router = useRouter();
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    switch (router.pathname) {
      case "/admin/dashboard":
        setTitle("Dashboard");
        break;
      case "/admin/user":
        setTitle("User Management");
        break;
      case "/admin/analystic":
        setTitle("Analytics");
        break;
      case "/admin/approveposter":
        setTitle("Approve Poster Registration");
        break;
      case "/admin/approvewithdraw":
        setTitle("Approve Withdrawals");
        break;
      case "/admin/listapartment":
        setTitle("List Apartments");
        break;
      case "/admin/transaction":
        setTitle("Transactions");
        break;
      case "/admin/uploadapartment":
        setTitle("Upload Apartment");
        break;
      default:
        setTitle("Dashboard");
    }
  }, [router.pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-muted pl-8 pr-4"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <img
                src="/placeholder.svg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
