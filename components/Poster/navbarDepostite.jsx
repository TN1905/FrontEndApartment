import React, { useState, useEffect, useContext } from "react";
import Card from "./Card";
import { menu_icon } from "../../utils/svgs";
import Modal from "./modal";
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
import { getVNPayDeposite } from "../../api/deposite/getVNPay";
import { getMOMODeposite } from "../../api/deposite/getMOMO";
import { getSolanaPrice } from "../../api/solana_api/get_price_solana";
import { getVNDPrice } from "../../api/VND_api/get_price_VND";
import { updateWallet } from "../../api/wallet/updateWallet";
import * as web3 from "@solana/web3.js";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
// allows us to choose from the available wallets supported by the wallet adapter
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
// imports a component which can be rendered in the browser

import { getWallet } from "../../api/wallet/getWallet";
import { getPaymentInfo } from "../../api/payment_info/getPaymentInfo";
import { createTransaction } from "../../api/walletTransaction/createTransaction";
import { HouseContext } from "../Apartment/HouseContext";

function NavbarDeposite() {
  const [account, setAccount] = useState(
    "8ghP25NjcAcrJashZpiTVxEELdzSmPLTd3pph21YmDyM"
  );
  const [amount, setAmount] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [balance, setBalance] = useState(0);
  const [txSig, setTxSig] = useState("");
  const [href, setHref] = useState(
    `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
  );
  const { wallet, depositeData, setDepositeData } = useContext(HouseContext);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Loại bỏ các ký tự không phải số
    setAmount(value ? parseInt(value, 10) : 0); // Cập nhật giá trị gốc
  };
  const formattedAmount = amount.toLocaleString("vi-VN");
  const [priceSolana, setPriceSolana] = useState({
    Symbol: "",
    Name: "",
    Address: "",
    Blockchain: "",
    Price: "",
    PriceYesterday: "",
    VolumeYesterdayUSD: "",
    Time: "",
    Source: "",
    Signature: "",
  });
  const [priceVND, setPriceVND] = useState({
    toCurrency: "",
    rate: "",
    fromCurrency: "",
  });

  const getPriceSolana = async () => {
    const priceCurrentSolana = await getSolanaPrice();
    setPriceSolana(priceCurrentSolana);
    console.log(priceCurrentSolana.Price);
    return priceCurrentSolana;
  };

  const getPriceVND = async () => {
    const priceCurrentVND = await getVNDPrice();
    setPriceVND(priceCurrentVND);
    console.log(priceCurrentVND.rate);
    return priceCurrentVND;
  };

  useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        // we get the account info for the user's wallet data store and set the balance in our application's state
        const info = await connection.getAccountInfo(publicKey);
        if (info) {
          setBalance(info.lamports / web3.LAMPORTS_PER_SOL);
        }
      }
    };
    getInfo();
  }, [connection, publicKey, balance]);

  const handlePaymentTypeClick = (type) => {
    setSelectedPaymentType(type);
  };

  const [paymentInfo, setPaymentInfo] = useState({
    id: "",
    name: "",
    payment_number: "",
    account_id: "",
  });

  const handleTransaction = async () => {
    if (!connection || !publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    try {
      const priceSolana = await getPriceSolana();
      const priceVND = await getPriceVND();

      const transaction = new web3.Transaction();
      console.log(transaction);
      const lamportsAmount = Math.round(
        (Number(amount) / (priceSolana.Price * priceVND.rate)) *
          web3.LAMPORTS_PER_SOL
      );
      console.log(lamportsAmount);
      console.log(publicKey);
      console.log(account);
      const instruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        lamports: lamportsAmount,
        toPubkey: account,
      });
      console.log(instruction);

      transaction.add(instruction);

      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature);

      if (signature) {
        const transactionData = {
          id: Date.now().toString(),
          amount: amount,
          localDateTime: new Date(),
          receiver: "Chiêm Nguyễn Trí Nguyên",
          receiver_payment_number:
            "8ghP25NjcAcrJashZpiTVxEELdzSmPLTd3pph21YmDyM",
          txig: signature,
          wallet: wallet,
          transactionType: "DEPOSITE",
        };
        createTransaction(transactionData)
          .then((data) => {
            wallet.balance = wallet.balance + amount;

            console.log("Tạo giao dịch thành công:", data);
            updateWallet(wallet.id, wallet)
              .then((data) => {
                console.log("Cập nhật số dư thành công:", data);
                setBalance(wallet.balance);
              })
              .catch((error) => {
                console.error("Cập nhật số dư thất bại:", error.message);
              });
          })
          .catch((error) => {
            console.error("Lỗi khi tạo giao dịch:", error.message);
          });
      }
      toast.success("Transaction successful!");
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed!");
    }
  };

  const deposite = async (amount, selectedPayment) => {
    console.log(amount);
    console.log(selectedPayment);
    switch (selectedPayment) {
      case "momo":
        try {
          const data = await getMOMODeposite(wallet.id, amount);
          setDepositeData(data);
          console.log(data);
          window.location.href = data.URL; // Navigate to the payment URL
        } catch (error) {
          console.error("Error:", error);
        }
        break;
      case "vnpay":
        try {
          const data = await getVNPayDeposite(wallet.id, amount);
          console.log(data);
          setDepositeData(data);
          window.location.href = data.URL; // Navigate to the payment URL
        } catch (error) {
          console.error("Error:", error);
        }
        break;
      case "solana":
        if (!account || !amount) {
          toast.error("Tài khoản chưa đăng nhập hoặc không đủ số dư");
        } else {
          handleTransaction();
        }
        break;
      default:
        alert("Chỉ hỗ trợ thanh toán Momo, Vnpay, Solana");
    }
  };

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 w-full"
          >
            <UploadIcon className="w-5 h-5 text-primary" />
            Deposite
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Deposit</DialogTitle>
            <DialogDescription>Select a payment method</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Button
              variant="ghost"
              className={selectedPaymentType === "momo" ? "bg-muted" : ""}
              onClick={() => handlePaymentTypeClick("momo")}
            >
              <img
                src="assets/img/momo.jpg"
                alt="MOMO"
                width={48}
                height={48}
                className="rounded-full"
              />
            </Button>
            <Button
              variant="ghost"
              className={selectedPaymentType === "vnpay" ? "bg-muted" : ""}
              onClick={() => handlePaymentTypeClick("vnpay")}
            >
              <img
                src="assets/img/vnpay.jpg"
                alt="VNPAY"
                width={48}
                height={48}
                className="rounded-full"
              />
            </Button>
            <Button
              variant="ghost"
              className={selectedPaymentType === "solana" ? "bg-muted" : ""}
              onClick={() => handlePaymentTypeClick("solana")}
            >
              <img
                src="assets/img/solana.jpg"
                alt="Solana"
                width={48}
                height={48}
                className="rounded-full"
              />
            </Button>
          </div>
          {selectedPaymentType && (
            <div className="mt-6">
              <div className="flex items-center gap-4">
                {selectedPaymentType === "momo" && (
                  <img
                    src="assets/img/momo.jpg"
                    alt="MOMO"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                {selectedPaymentType === "vnpay" && (
                  <img
                    src="assets/img/vnpay.jpg"
                    alt="VNPAY"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                {selectedPaymentType === "solana" && (
                  <img
                    src="assets/img/solana.jpg"
                    alt="Solana"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{selectedPaymentType}</div>
                  <div className="text-muted-foreground text-sm">
                    {selectedPaymentType === "momo"
                      ? "Mobile Money"
                      : selectedPaymentType === "vnpay"
                      ? "Vietnam Payment Gateway"
                      : "Solana Blockchain"}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter deposit amount"
                  value={formattedAmount}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => deposite(amount, selectedPaymentType)}>
                  Deposit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NavbarDeposite;

function CreditCardIcon(props) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

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

function UploadIcon(props) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}


