import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import PosterLayout from "../layouts/PosterLayout";
import Transaction from "../components/Poster/HistoryTransaction/HistoryTransaction";
import { createTransaction } from "../api/walletTransaction/createTransaction";
import { getWallet } from "../api/wallet/getWallet";
import { updateWallet } from "../api/wallet/updateWallet";
import { getPaymentInfo } from "../api/payment_info/getPaymentInfo";
import {getTransactionOne} from "../api/walletTransaction/getTransaction";
import { getAllTransaction } from "../api/walletTransaction/getAllTransaction";
import { HouseContext } from "../components/Apartment/HouseContext";
const MyTransaction = () => {
  const router = useRouter();
  const {user, wallet} = useContext(HouseContext);


 useEffect(() => {
   if (!router.isReady) return;

   console.log(router.query); // Thêm dòng này để kiểm tra giá trị của router.query

   const fetchData = async () => {
     // Lấy các giá trị từ URL query parameters
     let id = "";
     let amount = 0;
     let signature = "";
     if (
       router.query.vnp_TransactionNo &&
       router.query.vnp_Amount &&
       router.query.vnp_TxnRef
     ) {
       id = router.query.vnp_TransactionNo;
       amount = Number.parseFloat(router.query.vnp_Amount) / 100;
       signature = router.query.vnp_TxnRef; 
     } else if (
       router.query.orderId &&
       router.query.amount &&
       router.query.signature
     ) {
       id = router.query.orderId;
       amount = Number.parseFloat(router.query.amount);
       signature = router.query.signature;
     }

     if (id && amount && wallet) {
       const transactionData = {
         id: id,
         amount: amount,
         localDateTime: new Date(),
         receiver: "Chiêm Nguyễn Trí Nguyên",
         receiver_payment_number: "0779696443",
         txig: signature,
         wallet: wallet,
         transactionType: "DEPOSITE",
       };
       console.log(transactionData);
       createTransaction(transactionData)
         .then((data) => {
           wallet.balance = wallet.balance + amount;
           console.log(wallet.balance);
           console.log(wallet.id);
           console.log("Tạo giao dịch thành công:", data);
           updateWallet(wallet.id, wallet)
             .then((data) => {
               console.log("Cập nhật số dư thành công:", data);
               window.location.href = "http://localhost:3000/transaction";
             })
             .catch((error) => {
               console.error("Cập nhật số dư thất bại:", error.message);
             });
         })
         .catch((error) => {
           console.error("Lỗi khi tạo giao dịch:", error.message);
         });
     }
   };

   fetchData();
 }, [router.isReady, router.query, wallet]);


  return (
    <PosterLayout
    >
      <Transaction />
    </PosterLayout>
  );
};

export default MyTransaction;
