import React, { useState, useEffect, useContext } from "react";
import PosterLayout from "../layouts/PosterLayout";
import Profile from "../components/Poster/Profile/Profile";
import RentedApartment from "../components/Poster/RentedApartment/RentedApartment";
import { useRouter } from "next/router";
import { HouseContext } from "../components/Apartment/HouseContext";
import { getWallet } from "../api/wallet/getWallet";
import { createTransaction } from "../api/walletTransaction/createTransaction";
import {createRentApartment} from "../api/rentApartment/createRentApartment";
import {updateWallet} from "../api/wallet/updateWallet";
import {updateApartment} from "../api/apartments/updateApartment";
import { createContract } from "../api/sendcontract/sendContract";
import { getRentedByAccount } from "../api/walletTransaction/getRentedByAccount";
import { createMessageUser } from "../api/messages/createMessageUser";
import { createMinfNft } from "../api/mintnft/createMintNft";
import {updateRentApartment} from "../api/rentApartment/updateRentApartment";
import {checkBronze,checkSilver,checkGold,checkPlatinum,checkDiamond} from "../api/mintnft/checkRank";
const MyRentedApartment = () => {
  const router = useRouter();
  const {
    user,
    wallet,
  } = useContext(HouseContext);

  useEffect(() => {
    if (!router.isReady) return;

    console.log(router.query); // Thêm dòng này để kiểm tra giá trị của router.query

    const fetchData = async () => {
      let dataRentMOMO = null;
      let dataRentVNPAY = null;
      let dataExtendMOMO = null;
      let dataExtendVNPAY = null;
      let ownerApartment = "";
      let infopayment = "";
      let apartment = "";
      const savedRentApartmentDataMOMO = localStorage.getItem(
        "rentApartmentDataMOMO"
      );
      const savedRentApartmentDataVNPAY = localStorage.getItem(
        "rentApartmentDataVNPAY"
      );
      const savedExtendApartmentDataMOMO = localStorage.getItem(
        "extendApartmentDataMOMO"
      );
      const savedExtendApartmentDataVNPAY = localStorage.getItem(
        "extendApartmentDataVNPAY"
      );

      if (savedRentApartmentDataMOMO) {
        console.log(savedRentApartmentDataMOMO);
        dataRentMOMO = JSON.parse(savedRentApartmentDataMOMO);
        console.log(savedRentApartmentDataMOMO, "?");
      } else if (savedRentApartmentDataVNPAY) {
        console.log(savedRentApartmentDataVNPAY);
        dataRentVNPAY = JSON.parse(savedRentApartmentDataVNPAY);
        console.log(savedRentApartmentDataVNPAY, "?");
      }else if(savedExtendApartmentDataMOMO){
        console.log(savedExtendApartmentDataMOMO);
        dataExtendMOMO = JSON.parse(savedExtendApartmentDataMOMO);
        console.log(savedExtendApartmentDataMOMO, "?");
      }else if (savedExtendApartmentDataVNPAY) {
        console.log(savedExtendApartmentDataVNPAY);
        dataExtendVNPAY = JSON.parse(savedExtendApartmentDataVNPAY);
        console.log(savedExtendApartmentDataVNPAY, "?");
      }

      const walletAdmin = await getWallet(1705562446065);

      if (dataRentMOMO !== null && dataRentMOMO !== "") {
        console.log(dataRentMOMO);
        ownerApartment = dataRentMOMO.apartment.account.username;
        const numberPay = await getWallet(dataRentMOMO.apartment.account.id);
        apartment = dataRentMOMO.apartment;
        if (numberPay) {
          infopayment = walletAdmin.paymentInfo.find((d) => d.name === "momo");
        }
      } else if (dataRentVNPAY !== null && dataRentVNPAY !== "") {
        console.log(dataRentVNPAY,"????");
        ownerApartment = dataRentVNPAY.apartment.account.username;
        const numberPay = await getWallet(dataRentVNPAY.apartment.account.id);
        apartment = dataRentVNPAY.apartment;
        if (numberPay) {
          infopayment = walletAdmin.paymentInfo.find((d) => d.name === "vnpay");
        }
      }else if(dataExtendMOMO !== null && dataExtendMOMO !== ""){
        console.log(dataExtendMOMO);
        ownerApartment = dataExtendMOMO.apartment.account.username;
        const numberPay = await getWallet(dataExtendMOMO.apartment.account.id);
        apartment = dataExtendMOMO.apartment;
        if (numberPay) {
          infopayment = walletAdmin.paymentInfo.find((d) => d.name === "momo");
        }
      }else if (dataExtendVNPAY !== null && dataExtendVNPAY !== "") {
        console.log(dataExtendVNPAY);
        ownerApartment = dataExtendVNPAY.apartment.account.username;
        const numberPay = await getWallet(dataExtendVNPAY.apartment.account.id);
        apartment = dataExtendVNPAY.apartment;
        if (numberPay) {
          infopayment = walletAdmin.paymentInfo.find((d) => d.name === "momo");
        }
      }

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
      const finalAmount = amount - Math.round(amount * 0.03);
      if (id && amount && wallet && walletAdmin) {
        const transactionData = {
          id: id,
          amount: finalAmount,
          localDateTime: new Date(),
          receiver: ownerApartment,
          receiver_payment_number: infopayment.payment_number,
          txig: signature,
          wallet: wallet,
          transactionType: "RENTED",
        };
        const transactionDataAdmin = {
          id: new Date().getTime().toString(),
          amount: Math.round(amount * 0.03),
          localDateTime: new Date(),
          receiver: "Chiêm Nguyễn Trí Nguyên",
          receiver_payment_number: "0779696443",
          txig: signature,
          wallet: wallet,
          transactionType: "COMMISSION",
        };
        console.log(transactionData);

        if (dataRentMOMO !== null && dataRentMOMO !== "") {
          localStorage.removeItem("rentApartmentDataMOMO");
          await createRentApartment(dataRentMOMO)
            .then((data) => {
              console.log("Thêm rent thành công", data);
              createTransaction(transactionData)
                .then((data) => {
                  walletAdmin.balance += Math.round(amount * 0.03);
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
                              createContract(user.username, dataRentMOMO.id)
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
                                      totalRented < 1000000000 &&
                                      totalRented >= 500000000 &&
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
                                      totalRented < 500000000 &&
                                      totalRented >= 200000000 &&
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
                                      totalRented < 200000000 &&
                                      totalRented >= 50000000 &&
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
                                          console.log("MESSAGE: ", data);
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
                          // window.location.href =
                          //   "http://localhost:3000/rentedapartment";
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
        } else if (dataRentVNPAY !== null && dataRentVNPAY !== "") {
          localStorage.removeItem("rentApartmentDataVNPAY");
          await createRentApartment(dataRentVNPAY)
            .then((data) => {
              console.log("Thêm rent thành công", data);
              createTransaction(transactionData)
                .then((data) => {
                  walletAdmin.balance += Math.round(amount * 0.03);
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
                              createContract(user.username, dataRentVNPAY.id)
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

                                    if (
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
                                      totalRented >= 50000000 &&
                                      totalRented < 200000000 &&
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
                                      totalRented >= 200000000 &&
                                      totalRented < 500000000 &&
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
                                      totalRented >= 1000000000 &&
                                      !diamond
                                    ) {
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
                          // window.location.href =
                          //   "http://localhost:3000/rentedapartment";
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
        } else if (dataExtendVNPAY !== null && dataExtendVNPAY !== "") {
          localStorage.removeItem("extendApartmentDataVNPAY");
          await updateRentApartment(
            dataExtendVNPAY.apartment.id,
            dataExtendVNPAY.monthrent
          )
            .then((data) => {
              console.log("Gia hạn thành công", data);
              createTransaction(transactionData)
                .then((data) => {
                  walletAdmin.balance += Math.round(amount * 0.03);
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
                              createContract(user.username, dataExtendVNPAY.id)
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

                                    if (
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
                                      totalRented >= 50000000 &&
                                      totalRented < 200000000 &&
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
                                      totalRented >= 200000000 &&
                                      totalRented < 500000000 &&
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
                                      totalRented >= 1000000000 &&
                                      !diamond
                                    ) {
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
                          // window.location.href =
                          //   "http://localhost:3000/rentedapartment";
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
        } else if (dataExtendMOMO !== null && dataExtendMOMO !== "") {
          localStorage.removeItem("extendApartmentDataMOMO");
          await updateRentApartment(
            dataExtendMOMO.apartment.id,
            dataExtendMOMO.monthrent
          )
            .then((data) => {
              console.log("Gia hạn thành công", data);
              createTransaction(transactionData)
                .then((data) => {
                  walletAdmin.balance += Math.round(amount * 0.03);
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
                              createContract(user.username, dataExtendVNPAY.id)
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

                                    if (
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
                                      totalRented >= 50000000 &&
                                      totalRented < 200000000 &&
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
                                      totalRented >= 200000000 &&
                                      totalRented < 500000000 &&
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
                                      totalRented >= 1000000000 &&
                                      !diamond
                                    ) {
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
                          // window.location.href =
                          //   "http://localhost:3000/rentedapartment";
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
      }
    };

    fetchData();
  }, [router.isReady, router.query, wallet]);
  
  return (
    <PosterLayout>
      <RentedApartment />
    </PosterLayout>
  );
};

export default MyRentedApartment;
