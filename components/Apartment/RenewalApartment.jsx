import React, { useState, useContext, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { HouseContext } from "../Apartment/HouseContext";
import { getApartmentOne } from "../../api/apartments/getApartmentOne";
import { getWallet } from "../../api/wallet/getWallet";
import { getListApartmentRent } from "../../api/rentApartment/getApartmentRent";
import { vnpayRent } from "../../api/rentMethodPayment/vnpayRent";
import { momoRent } from "../../api/rentMethodPayment/momoRent";
import * as web3 from "@solana/web3.js";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { createTransaction } from "../../api/walletTransaction/createTransaction";
import { createContract } from "../../api/sendcontract/sendContract";
import { createMinfNft } from "../../api/mintnft/createMintNft";
import {
  checkBronze,
  checkSilver,
  checkGold,
  checkPlatinum,
  checkDiamond,
} from "../../api/mintnft/checkRank";
// imports a component which can be rendered in the browser
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { getSolanaPrice } from "../../api/solana_api/get_price_solana";
import { getVNDPrice } from "../../api/VND_api/get_price_VND";
import { getPaymentInfo } from "../../api/payment_info/getPaymentInfo";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createRentApartment } from "../../api/rentApartment/createRentApartment";
import {updateRentApartment} from "../../api/rentApartment/updateRentApartment";
import { updateWallet } from "../../api/wallet/updateWallet";
import { updateApartment } from "../../api/apartments/updateApartment";
import { useTranslation } from "../../hooks/useTranslation";
import { getNFTs } from "../../api/mintnft/findCollection";
import { getRentedByAccount } from "../../api/walletTransaction/getRentedByAccount";
import { createMessageUser } from "../../api/messages/createMessageUser";
const RentApartment = () => {
  const { user, wallet, setWallet, message, setMessage } =
    useContext(HouseContext);
  const [apartment, setApartment] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const [apartmentPrice, setApartmentPrice] = useState(0);
  const [rentDuration, setRentDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [rentApartment, setRentApartment] = useState([]);
  const [monthRent, setMonthRent] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [account, setAccount] = useState(
    "8ghP25NjcAcrJashZpiTVxEELdzSmPLTd3pph21YmDyM"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isNotEnoughBalance, setIsNotEnoughBalance] = useState(false);

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [txSig, setTxSig] = useState("");
  const [userOfApartment, setUserOfApartment] = useState();
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [checkPasswordPayment, setPasswordPayment] = useState();
  const [isNotCurrentWallet, setIsNotCurrentWallet] = useState(false);
  const { t } = useTranslation();
  const [href, setHref] = useState(
    `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
  );
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
  const [selectedNft, setSelectedNft] = useState({
    image_uri: "",
    name: "",
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

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [nftData, setNftData] = useState([]); // Khởi tạo với một mảng trống

  useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        const nftAccountData = await getNFTs(publicKey);
        if (nftAccountData && Array.isArray(nftAccountData)) {
          setNftData(nftAccountData);
          console.log("NFTSSSSSS:", nftAccountData);
        } else {
          console.error("nftAccountData is not an array:", nftAccountData);
        }
        // we get the account info for the user's wallet data store and set the balance in our application's state
        const info = await connection.getAccountInfo(publicKey);
        if (info) {
          setBalance(info.lamports / web3.LAMPORTS_PER_SOL);
        }
      }
    };
    getInfo();
  }, [connection, publicKey, balance]);

  const getDataRentApartment = async () => {
    const apartmentRentData = await getListApartmentRent(id);
    console.log(apartmentRentData);

    if (apartmentRentData) {
      setRentApartment(apartmentRentData);
    }
  };

  const getWalletOne = async () => {
    const walletData = await getWallet(user.id);
    if (walletData) {
      setWallet(walletData);
    }
  };

  const loadPriceApart = (month) => {
    const price = apartment.price * month - discount;
    setApartmentPrice(price);
    setMonthRent(month);
  };

  const getApartmentDetail = async () => {
    const apartData = await getApartmentOne(id);
    if (apartData) {
      setApartment(apartData);
      setApartmentPrice(apartData.price);
      console.log(apartData.account.id, "???");
      setUserOfApartment(apartData.account);
      const data = await getWallet(apartData.account.id);
      if (data) {
        const paymentNames = data.paymentInfo.map((d) => d.name);
        setPaymentInfo(paymentNames);
      }
    }
  };

  // useEffect để log giá trị của paymentInfo sau khi nó được cập nhật
  useEffect(() => {
    console.log(paymentInfo);
  }, [paymentInfo]);

  // Gọi các hàm khởi tạo dữ liệu trong useEffect khi component được mount
  useEffect(() => {
    getApartmentDetail();
    getWalletOne();
    getDataRentApartment();
    console.log(apartment);
    console.log(user);
  }, []);

  useEffect(() => {
    console.log("selectedNft: ", selectedNft);
    if (selectedNft) {
      // Kiểm tra nếu selectedNft tồn tại
      if (selectedNft.name === "Easy Rent Apartment") {
        const dis = apartmentPrice * 0.01;
        setDiscount(dis);
        setApartmentPrice(apartment.price * monthRent - dis);
      } else if (selectedNft.name === "Easy Rent Apartment Silver") {
        const dis = apartmentPrice * 0.03;
        setDiscount(dis);
        setApartmentPrice(apartment.price * monthRent - dis);
      } else if (selectedNft.name === "Easy Rent Apartment Gold") {
        const dis = apartmentPrice * 0.05;
        setDiscount(dis);
        setApartmentPrice(apartment.price * monthRent - dis);
      } else if (selectedNft.name === "Easy Rent Apartment Platinum") {
        const dis = apartmentPrice * 0.1;
        setDiscount(dis);
        setApartmentPrice(apartment.price * monthRent - dis);
      } else if (selectedNft.name === "Easy Rent Apartment Diamond") {
        const dis = apartmentPrice * 0.2;
        setDiscount(dis);
        setApartmentPrice(apartment.price * monthRent - dis);
      }
    }
  }, [selectedNft, apartmentPrice]); // Thay đổi dependency thành selectedNft

  const validateForm = () => {
    const newErrors = {};
    if (!rentDuration) {
      newErrors.rentDuration = "Please select rent duration.";
    }
    if (!startDate) {
      newErrors.startDate = "Please select start date.";
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select payment method.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleCancelNotCurrent = () => {
    setIsNotCurrentWallet(false);
  };

  const handleCancelNotEnough = () => {
    setIsNotEnoughBalance(false);
  };

  const handleRentByCurrentWallet = async () => {
    let ownerApartment = "";
    let infopayment = "";
    const walletAdmin = await getWallet(1705562446065);
    if (walletAdmin) {
      const now = new Date();
      const timestamp = now.getTime().toString();
      const enddate = new Date(startDate);
      enddate.setMonth(now.getMonth() + Number(monthRent));
      ownerApartment = apartment.account.username;
      const numberPay = await getWallet(apartment.account.id);

      if (numberPay) {
        infopayment = numberPay.paymentInfo.find((d) => d.name === "solana");
      }
      const finalAmount = apartmentPrice - Math.round(apartmentPrice * 0.03);
      const transactionData = {
        id: Date.now().toString(),
        amount: finalAmount,
        localDateTime: new Date(),
        receiver: ownerApartment,
        receiver_payment_number: numberPay.id,
        txig: "WALLET",
        wallet: wallet,
        transactionType: "RENTED",
      };
      const idTransactionForAdmin = new Date().getTime().toString() + 1;
      const transactionDataAdmin = {
        id: idTransactionForAdmin,
        amount: Math.round(apartmentPrice * 0.03),
        localDateTime: new Date(),
        receiver: "Chiểm Nguyễn Trí Nguyên",
        receiver_payment_number: "1",
        txig: "WALLET",
        wallet: wallet,
        transactionType: "COMMISSION",
      };
      const rentApartmentData = {
        id: timestamp,
        createdate: new Date(startDate).toISOString(),
        enddate: new Date(enddate).toISOString(),
        account: user,
        apartment: apartment,
        status: "RENTED",
        monthrent: monthRent,
      };
      await updateRentApartment(apartment.id, Number(monthRent))
        .then((data) => {
          console.log("Gia hạn thành công", data);
          createTransaction(transactionData)
            .then((data) => {
              walletAdmin.balance =
                walletAdmin.balance + Math.round(apartmentPrice * 0.03);
              console.log(wallet.balance);
              console.log(wallet.id);
              console.log("Tạo giao dịch thành công:", data);
              createTransaction(transactionDataAdmin)
                .then((data) => {
                  console.log("tạo giao dịch thành công", data);
                  updateWallet(walletAdmin.id, walletAdmin)
                    .then((data) => {
                      wallet.balance = wallet.balance - apartmentPrice;
                      console.log("Cập nhật số dư thành công:", data);
                      apartment.status = "RENTED";
                      updateApartment(apartment.id, apartment)
                        .then((data) => {
                          console.log("update status apartment", data);
                          updateWallet(wallet.id, wallet)
                            .then((data) => {
                              console.log("Cập nhật số dư thành công:", data);
                              createContract(
                                user.username,
                                rentApartmentData.id
                              )
                                .then(async (data) => {
                                  console.log("send constract success", data);
                                  const totalRented = await getRentedByAccount(
                                    wallet.id
                                  );
                                  const bronze = await checkBronze(user.id);
                                  const silver = await checkSilver(user.id);
                                  const gold = await checkGold(user.id);
                                  const platinum = await checkPlatinum(user.id);
                                  const diamond = await checkDiamond(user.id);
                                  if (totalRented) {
                                    console.log(totalRented);
                                    const timenow = Date.now();

                                    if (totalRented >= 1000000000 && !diamond) {
                                      const messageData = {
                                        id: timenow,
                                        description:
                                          "Claim your Diamond NFT to use Coupon for discount",
                                        status: true,
                                        title: "Claim Diamond NFT",
                                        account: user,
                                        createtime: timenow,
                                      };
                                      createMessageUser(messageData)
                                        .then((data) => {
                                          console.log("MESSAGE: ", data);
                                          const mintNftData = {
                                            id: timenow,
                                            is_enabled: true,
                                            type_nft: "DIAMOND",
                                            account: user,
                                          };
                                          createMinfNft(mintNftData)
                                            .then((data) => {
                                              console.log(
                                                "CREATE MINT NFT",
                                                data
                                              );
                                            })
                                            .catch((error) => {
                                              console.log(
                                                "ERROR MINT NFT: ",
                                                error
                                              );
                                            });
                                        })
                                        .catch((error) => {
                                          console.log("MESSAGE ERROR: ", error);
                                        });
                                    } else if (
                                      totalRented >= 500000000 &&
                                      totalRented < 1000000000 &&
                                      !platinum
                                    ) {
                                      const messageData = {
                                        id: timenow,
                                        description:
                                          "Claim your Platinum NFT to use Coupon for discount",
                                        status: true,
                                        title: "Claim Platinum NFT",
                                        account: user,
                                        createtime: timenow,
                                      };
                                      createMessageUser(messageData)
                                        .then((data) => {
                                          console.log("MESSAGE: ", data);
                                          const mintNftData = {
                                            id: timenow,
                                            is_enabled: true,
                                            type_nft: "PLATINUM",
                                            account: user,
                                          };
                                          createMinfNft(mintNftData)
                                            .then((data) => {
                                              console.log(
                                                "CREATE MINT NFT",
                                                data
                                              );
                                            })
                                            .catch((error) => {
                                              console.log(
                                                "ERROR MINT NFT: ",
                                                error
                                              );
                                            });
                                        })
                                        .catch((error) => {
                                          console.log("MESSAGE ERROR: ", error);
                                        });
                                    } else if (
                                      totalRented >= 200000000 &&
                                      totalRented < 500000000 &&
                                      !gold
                                    ) {
                                      const messageData = {
                                        id: timenow,
                                        description:
                                          "Claim your Gold NFT to use Coupon for discount",
                                        status: true,
                                        title: "Claim Gold NFT",
                                        account: user,
                                        createtime: timenow,
                                      };
                                      createMessageUser(messageData)
                                        .then((data) => {
                                          console.log("MESSAGE: ", data);
                                          const mintNftData = {
                                            id: timenow,
                                            is_enabled: true,
                                            type_nft: "GOLD",
                                            account: user,
                                          };
                                          createMinfNft(mintNftData)
                                            .then((data) => {
                                              console.log(
                                                "CREATE MINT NFT",
                                                data
                                              );
                                            })
                                            .catch((error) => {
                                              console.log(
                                                "ERROR MINT NFT: ",
                                                error
                                              );
                                            });
                                        })
                                        .catch((error) => {
                                          console.log("MESSAGE ERROR: ", error);
                                        });
                                    } else if (
                                      totalRented >= 5000000 &&
                                      totalRented < 200000000 &&
                                      !silver
                                    ) {
                                      const messageData = {
                                        id: timenow,
                                        description:
                                          "Claim your Silver NFT to use Coupon for discount",
                                        status: true,
                                        title: "Claim Silver NFT",
                                        account: user,
                                        createtime: timenow,
                                      };
                                      createMessageUser(messageData)
                                        .then((data) => {
                                          console.log("MESSAGE: ", data);
                                          const mintNftData = {
                                            id: timenow,
                                            is_enabled: true,
                                            type_nft: "SILVER",
                                            account: user,
                                          };
                                          createMinfNft(mintNftData)
                                            .then((data) => {
                                              console.log(
                                                "CREATE MINT NFT",
                                                data
                                              );
                                            })
                                            .catch((error) => {
                                              console.log(
                                                "ERROR MINT NFT: ",
                                                error
                                              );
                                            });
                                        })
                                        .catch((error) => {
                                          console.log("MESSAGE ERROR: ", error);
                                        });
                                    } else if (
                                      totalRented >= 20000000 &&
                                      totalRented < 50000000 &&
                                      !bronze
                                    ) {
                                      const messageData = {
                                        id: timenow,
                                        description:
                                          "Claim your Bronze NFT to use Coupon for discount",
                                        status: true,
                                        title: "Claim Bronze NFT",
                                        account: user,
                                        createtime: timenow,
                                      };
                                      createMessageUser(messageData)
                                        .then((data) => {
                                          console.log("MESSAGE: ", data);
                                          const mintNftData = {
                                            id: timenow,
                                            is_enabled: true,
                                            type_nft: "BRONZE",
                                            account: user,
                                          };
                                          createMinfNft(mintNftData)
                                            .then((data) => {
                                              console.log(
                                                "CREATE MINT NFT",
                                                data
                                              );
                                            })
                                            .catch((error) => {
                                              console.log(
                                                "ERROR MINT NFT: ",
                                                error
                                              );
                                            });
                                        })
                                        .catch((error) => {
                                          console.log("MESSAGE ERROR: ", error);
                                        });
                                    }
                                  }
                                })
                                .catch((error) => {
                                  console.log("send constract failed", error);
                                });
                            })
                            .catch((error) => {
                              console.error(
                                "Cập nhật số dư thất bại:",
                                error.message
                              );
                            });
                        })
                        .catch((error) => {
                          console.log("update status fail", error);
                        });
                      window.location.href =
                        "http://localhost:3000/rentedapartment";
                    })
                    .catch((error) => {
                      console.error("Cập nhật số dư thất bại:", error.message);
                    });
                })
                .catch((error) => {
                  console.log("tạo giao dịch thất bại", error);
                });
            })
            .catch((error) => {
              console.error("Lỗi khi tạo giao dịch:", error.message);
            });
        })
        .catch((error) => {
          console.log("Thêm rent thất bại", error);
        });
    }
  };

  const handleTransaction = async () => {
    if (!connection || !publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    try {
      const priceSolana = await getPriceSolana();
      const priceVND = await getPriceVND();

      const transaction = new web3.Transaction();
      const lamportsAmount = Math.round(
        (apartmentPrice / (priceSolana.Price * priceVND.rate)) *
          web3.LAMPORTS_PER_SOL
      );

      const instruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        lamports: lamportsAmount,
        toPubkey: account,
      });

      transaction.add(instruction);

      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature);
      let ownerApartment = "";
      let infopayment = "";
      const walletAdmin = await getWallet(1705562446065);
      if (signature) {
        const now = new Date();
        const timestamp = now.getTime().toString();
        const enddate = new Date(startDate);
        enddate.setMonth(now.getMonth() + Number(monthRent));
        ownerApartment = apartment.account.username;
        const numberPay = await getWallet(apartment.account.id);

        if (numberPay) {
          infopayment = numberPay.paymentInfo.find((d) => d.name === "solana");
        }
        const finalAmount = apartmentPrice - Math.round(apartmentPrice * 0.03);
        const transactionData = {
          id: Date.now().toString(),
          amount: finalAmount,
          localDateTime: new Date(),
          receiver: ownerApartment,
          receiver_payment_number: infopayment.payment_number,
          txig: signature,
          wallet: wallet,
          transactionType: "RENTED",
        };
        const idTransactionForAdmin = new Date().getTime().toString() + 1;
        const transactionDataAdmin = {
          id: idTransactionForAdmin,
          amount: Math.round(apartmentPrice * 0.03),
          localDateTime: new Date(),
          receiver: "Chiểm Nguyễn Trí Nguyên",
          receiver_payment_number:
            "8ghP25NjcAcrJashZpiTVxEELdzSmPLTd3pph21YmDyM",
          txig: signature,
          wallet: wallet,
          transactionType: "COMMISSION",
        };
        const rentApartmentData = {
          id: timestamp,
          createdate: new Date(startDate).toISOString(),
          enddate: new Date(enddate).toISOString(),
          account: user,
          apartment: apartment,
          status: "RENTED",
          monthrent: monthRent,
        };
        await updateRentApartment(apartment.id, Number(monthRent))
          .then((data) => {
            console.log("Gia hạn thành công", data);
            createTransaction(transactionData)
              .then((data) => {
                walletAdmin.balance =
                  walletAdmin.balance + Math.round(apartmentPrice * 0.03);
                console.log(wallet.balance);
                console.log(wallet.id);
                console.log("Tạo giao dịch thành công:", data);
                createTransaction(transactionDataAdmin)
                  .then((data) => {
                    console.log("tạo giao dịch thành công", data);
                    updateWallet(walletAdmin.id, walletAdmin)
                      .then((data) => {
                        console.log("Cập nhật số dư thành công:", data);
                        apartment.status = "RENTED";
                        updateApartment(apartment.id, apartment)
                          .then((data) => {
                            console.log("update status apartment", data);
                            createContract(user.username, rentApartmentData.id)
                              .then(async (data) => {
                                console.log("send constract success", data);
                                const totalRented = await getRentedByAccount(
                                  wallet.id
                                );
                                const bronze = await checkBronze(user.id);
                                const silver = await checkSilver(user.id);
                                const gold = await checkGold(user.id);
                                const platinum = await checkPlatinum(user.id);
                                const diamond = await checkDiamond(user.id);
                                if (totalRented) {
                                  console.log(totalRented);
                                  const timenow = Date.now();

                                  if (totalRented >= 1000000000 && !diamond) {
                                    const messageData = {
                                      id: timenow,
                                      description:
                                        "Claim your Diamond NFT to use Coupon for discount",
                                      status: true,
                                      title: "Claim Diamond NFT",
                                      account: user,
                                      createtime: timenow,
                                    };
                                    createMessageUser(messageData)
                                      .then((data) => {
                                        console.log("MESSAGE: ", data);
                                        const mintNftData = {
                                          id: timenow,
                                          is_enabled: true,
                                          type_nft: "DIAMOND",
                                          account: user,
                                        };
                                        createMinfNft(mintNftData)
                                          .then((data) => {
                                            console.log(
                                              "CREATE MINT NFT",
                                              data
                                            );
                                          })
                                          .catch((error) => {
                                            console.log(
                                              "ERROR MINT NFT: ",
                                              error
                                            );
                                          });
                                      })
                                      .catch((error) => {
                                        console.log("MESSAGE ERROR: ", error);
                                      });
                                  } else if (
                                    totalRented >= 500000000 &&
                                    totalRented < 1000000000 &&
                                    !platinum
                                  ) {
                                    const messageData = {
                                      id: timenow,
                                      description:
                                        "Claim your Platinum NFT to use Coupon for discount",
                                      status: true,
                                      title: "Claim Platinum NFT",
                                      account: user,
                                      createtime: timenow,
                                    };
                                    createMessageUser(messageData)
                                      .then((data) => {
                                        console.log("MESSAGE: ", data);
                                        const mintNftData = {
                                          id: timenow,
                                          is_enabled: true,
                                          type_nft: "PLATINUM",
                                          account: user,
                                        };
                                        createMinfNft(mintNftData)
                                          .then((data) => {
                                            console.log(
                                              "CREATE MINT NFT",
                                              data
                                            );
                                          })
                                          .catch((error) => {
                                            console.log(
                                              "ERROR MINT NFT: ",
                                              error
                                            );
                                          });
                                      })
                                      .catch((error) => {
                                        console.log("MESSAGE ERROR: ", error);
                                      });
                                  } else if (
                                    totalRented >= 200000000 &&
                                    totalRented < 500000000 &&
                                    !gold
                                  ) {
                                    const messageData = {
                                      id: timenow,
                                      description:
                                        "Claim your Gold NFT to use Coupon for discount",
                                      status: true,
                                      title: "Claim Gold NFT",
                                      account: user,
                                      createtime: timenow,
                                    };
                                    createMessageUser(messageData)
                                      .then((data) => {
                                        console.log("MESSAGE: ", data);
                                        const mintNftData = {
                                          id: timenow,
                                          is_enabled: true,
                                          type_nft: "GOLD",
                                          account: user,
                                        };
                                        createMinfNft(mintNftData)
                                          .then((data) => {
                                            console.log(
                                              "CREATE MINT NFT",
                                              data
                                            );
                                          })
                                          .catch((error) => {
                                            console.log(
                                              "ERROR MINT NFT: ",
                                              error
                                            );
                                          });
                                      })
                                      .catch((error) => {
                                        console.log("MESSAGE ERROR: ", error);
                                      });
                                  } else if (
                                    totalRented >= 50000000 &&
                                    totalRented < 200000000 &&
                                    !silver
                                  ) {
                                    const messageData = {
                                      id: timenow,
                                      description:
                                        "Claim your Silver NFT to use Coupon for discount",
                                      status: true,
                                      title: "Claim Silver NFT",
                                      account: user,
                                      createtime: timenow,
                                    };
                                    createMessageUser(messageData)
                                      .then((data) => {
                                        console.log("MESSAGE: ", data);
                                        const mintNftData = {
                                          id: timenow,
                                          is_enabled: true,
                                          type_nft: "SILVER",
                                          account: user,
                                        };
                                        createMinfNft(mintNftData)
                                          .then((data) => {
                                            console.log(
                                              "CREATE MINT NFT",
                                              data
                                            );
                                          })
                                          .catch((error) => {
                                            console.log(
                                              "ERROR MINT NFT: ",
                                              error
                                            );
                                          });
                                      })
                                      .catch((error) => {
                                        console.log("MESSAGE ERROR: ", error);
                                      });
                                  } else if (
                                    totalRented >= 20000000 &&
                                    totalRented < 50000000 &&
                                    !bronze
                                  ) {
                                    const messageData = {
                                      id: timenow,
                                      description:
                                        "Claim your Bronze NFT to use Coupon for discount",
                                      status: true,
                                      title: "Claim Bronze NFT",
                                      account: user,
                                      createtime: timenow,
                                    };
                                    createMessageUser(messageData)
                                      .then((data) => {
                                        console.log("MESSAGE: ", data);
                                        const mintNftData = {
                                          id: timenow,
                                          is_enabled: true,
                                          type_nft: "BRONZE",
                                          account: user,
                                        };
                                        createMinfNft(mintNftData)
                                          .then((data) => {
                                            console.log(
                                              "CREATE MINT NFT",
                                              data
                                            );
                                          })
                                          .catch((error) => {
                                            console.log(
                                              "ERROR MINT NFT: ",
                                              error
                                            );
                                          });
                                      })
                                      .catch((error) => {
                                        console.log("MESSAGE ERROR: ", error);
                                      });
                                  }
                                }
                              })
                              .catch((error) => {
                                console.log("send constract failed", error);
                              });
                          })
                          .catch((error) => {
                            console.log("update status fail", error);
                          });
                        window.location.href =
                          "http://localhost:3000/rentedapartment";
                      })
                      .catch((error) => {
                        console.error(
                          "Cập nhật số dư thất bại:",
                          error.message
                        );
                      });
                  })
                  .catch((error) => {
                    console.log("tạo giao dịch thất bại", error);
                  });
              })
              .catch((error) => {
                console.error("Lỗi khi tạo giao dịch:", error.message);
              });
          })
          .catch((error) => {
            console.log("Thêm rent thất bại", error);
          });
      }
      toast.success("Transaction successful!");
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = now.getTime().toString();
    const enddate = new Date(startDate);

    enddate.setMonth(enddate.getMonth() + Number(monthRent));

    if (validateForm()) {
      const rentApartmentData = {
        id: timestamp,
        createdate: new Date(startDate).toISOString(),
        enddate: new Date(enddate).toISOString(),
        account: user,
        apartment: apartment,
        status: "RENTED",
        monthrent: monthRent,
      };

      try {
        if (paymentMethod === "vnpay") {
            const response = await vnpayRent(
              wallet.id,
              apartmentPrice,
              monthRent
            );
          localStorage.setItem(
            "extendApartmentDataVNPAY",
            JSON.stringify(rentApartmentData)
          );
          console.log("///////////////////////////////",data.URL);
          window.location.href = data.URL; // Navigate to the payment URL
          console.log("VNPAY response:", response);
        } else if (paymentMethod === "momo") {
          const response = await momoRent(wallet.id, apartmentPrice, monthRent);
          console.log("MOMO response:", response);
          localStorage.setItem(
            "extendApartmentDataMOMO",
            JSON.stringify(rentApartmentData)
          );
          window.location.href = data.URL; // Navigate to the payment URL
          console.log("VNPAY response:", response);
        } else if (paymentMethod === "solana") {
          console.log(account);
          console.log(apartmentPrice);
          if (!account || !apartmentPrice) {
            toast.error("Tài khoản chưa đăng nhập hoặc không đủ số dư");
          } else {
            handleTransaction();
          }
        } else if (paymentMethod === "current") {
          if (wallet.balance >= apartmentPrice) {
            if (wallet.password_payment === 0) {
              console.log(wallet.password_payment);
              setIsNotCurrentWallet(true);
            } else {
              setIsOpen(true);
            }
          } else {
            setIsNotEnoughBalance(true);
          }
        }
      } catch (error) {
        console.error("Payment processing error:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <div>
            <h1 className="text-3xl font-bold">Contract Extend Apartment</h1>
            <p className="text-muted-foreground">Fill the form to create contract extends your apartment</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t("first_name")}</Label>
                <Input
                  id="firstName"
                  className="text-black bg-slate-100 read-only"
                  value={user.firstname}
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t("last_name")}</Label>
                <Input
                  id="lastName"
                  className="text-black bg-slate-100 read-only"
                  value={user.lastname}
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="text-black bg-slate-100 read-only"
                  value={user.username}
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("phone_number")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={user.phone}
                  className="text-black bg-slate-100 read-only"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="apartmentName">{t("apartment_name")}</Label>
                <Input
                  id="apartmentName"
                  className="text-black bg-slate-100 read-only"
                  value={apartment?.content}
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Input
                  id="address"
                  value={apartment?.address}
                  className="text-black bg-slate-100 read-only"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ward">{t("ward")}</Label>
                  <Input
                    id="ward"
                    value={apartment.ward}
                    className="text-black bg-slate-100 read-only"
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="district">{t("district")}</Label>
                  <Input
                    id="district"
                    value={apartment.district}
                    className="text-black bg-slate-100 read-only"
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">{t("city")}</Label>
                  <Input
                    id="city"
                    value={apartment.city}
                    className="text-black bg-slate-100 read-only"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">{t("start_date")}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`${errors.startDate ? "border-red-500" : ""}`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">{errors.startDate}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentDuration">{t("rent_duration")}</Label>
                  <Select
                    id="rentDuration"
                    onValueChange={(value) => {
                      setRentDuration(value);
                      loadPriceApart(value);
                    }}
                    className={`${errors.rentDuration ? "border-red-500" : ""}`}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="1">1 {t("month")}</SelectItem>
                      <SelectItem value="3">3 {t("month")}</SelectItem>
                      <SelectItem value="6">6 {t("month")}</SelectItem>
                      <SelectItem value="12">12 {t("month")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.rentDuration && (
                    <p className="text-red-500 text-sm">
                      {errors.rentDuration}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid gap-2">
                <div className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground">
                  <div className="flex items-center gap-4">
                    <WalletIcon className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{t("current_wallet")}</p>
                      <p className="text-sm text-muted-foreground">
                        {wallet.balance?.toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <RadioGroup>
                    <RadioGroupItem
                      value="current-wallet"
                      id="current-wallet"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="current-wallet"
                      className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Label>
                  </RadioGroup>
                </div>
                <div className="grid gap-2 mt-4">
                  <WalletMultiButton className="!bg-helius-orange !rounded-xl hover:!bg-[#161b19] transition-all duration-200 mt-5" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t("price")}</Label>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price per month</span>
                  <span>{apartment.price?.toLocaleString("vi-VN")} VNĐ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Month Extends</span>
                  <span className="text-muted-foreground">{monthRent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-500">
                    - {discount.toLocaleString("vi-VN")}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{apartmentPrice.toLocaleString("vi-VN")} VNĐ</span>
                </div>
                {/* <Input
                  id="price"
                  type="text"
                  className="text-black bg-slate-100 read-only"
                  value={apartmentPrice?.toLocaleString("vi-VN")}
                  readOnly
                /> */}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label>{t("NFT Coupon")}</Label>
                <Select
                  id="nft-select"
                  value={selectedNft.mint}
                  onValueChange={(value) =>
                    setSelectedNft(nftData.find((nft) => nft.mint === value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-4">
                      <SelectValue placeholder="Select an NFT" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {nftData.map((nft, index) => (
                      <SelectItem key={index} value={nft.mint}>
                        <div className="flex items-center gap-4">
                          <img
                            src={nft.image_uri}
                            alt={nft.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                            style={{ aspectRatio: "40/40", objectFit: "cover" }}
                          />
                          <span>{nft.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <Select>
                  <SelectTrigger className="w-[300px] bg-card text-card-foreground border border-input rounded-md shadow-sm">
                    <SelectValue placeholder="Select an NFT" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground border border-input rounded-md shadow-sm overflow-hidden w-[300px]">
                    <SelectGroup>
                      {nftData.map((data, index) => {
                        return (
                          <SelectItem
                            value="nft1"
                            className="flex items-center gap-4 px-4 py-3 hover:bg-muted"
                            key={index}
                          >
                            <img
                              src={data.image_uri}
                              width={40}
                              height={40}
                              alt={data.name}
                              className="rounded-md"
                              style={{
                                aspectRatio: "40/40",
                                objectFit: "cover",
                              }}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{data.name}</div>
                              <div className="text-muted-foreground text-sm">
                                {data.description}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select> */}
              </div>
              <div className="grid gap-2 mt-4">
                <Label htmlFor="paymentMethod">{t("payment_method")}</Label>
                <Select
                  id="paymentMethod"
                  onValueChange={(value) => setPaymentMethod(value)}
                  className={`${errors.paymentMethod ? "border-red-500" : ""}`}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_payment_method")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="current">
                      {t("current_wallet")}
                    </SelectItem>
                    {paymentInfo.map((data, index) => (
                      <SelectItem value={data} key={index}>
                        {data}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="w-full md:w-auto bg-black text-white"
            >
              Contract Extends
            </Button>
          </div>
        </div>
        <div>
          {isOpen && (
            <Dialog defaultOpen>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Payment</DialogTitle>
                  <DialogDescription>
                    Please enter the 6-digit code sent to your phone to confirm
                    the payment.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      className="w-2/4 mx-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="w-2/4 mx-2"
                      onClick={handleRentByCurrentWallet}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {isNotCurrentWallet && (
            <Dialog defaultOpen>
              <DialogContent className="p-6 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("payment_by_current")}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancelNotCurrent}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleRentByCurrentWallet}>
                    {t("submit_payment")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {isNotEnoughBalance && (
            <Dialog defaultOpen>
              <DialogContent className="p-6 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("balance_not_enough")}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancelNotEnough}>
                    {t("cancel")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </form>
    </div>
  );
};

export default RentApartment;

function CheckIcon(props) {
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
      <path d="M20 6 9 17l-5-5" />
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
