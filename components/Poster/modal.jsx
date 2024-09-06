import React, { useState, useEffect} from "react";

const Modal = ({ isOpen, onClose }) => {
  

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const setSelecterdCustomAmount = (amount) => {
    setSelectedAmount(amount);
    setAmount(amount);
  };

  const [wallet, setWallet] = useState({
    id: "",
    balance: "",
    password_payment: "",
    account_id: "",
    payment_id: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    id: "",
    name: "",
    payment_number: "",
    account_id: "",
  });

  const fetchInitialData = async () => {
    try {
      const walletData = await getWallet();
      setWallet(walletData);
      console.log(walletData);
      const paymentInfoData = await getPaymentInfo();
      setPaymentInfo(paymentInfoData);
      console.log(paymentInfoData);
      return { walletData, paymentInfoData };
    } catch (error) {
      console.error("Error fetching initial data:", error.message);
      return {
        walletData: null,
        paymentInfoData: null,
      };
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
      const { walletData, paymentInfoData } =
        await fetchInitialData();

      const transaction = new web3.Transaction();
      const lamportsAmount = Math.round(
        (amount / (priceSolana.Price * priceVND.rate)) * web3.LAMPORTS_PER_SOL
      );

      const instruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        lamports: lamportsAmount,
        toPubkey: account,
      });

      transaction.add(instruction);

      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature);
      
      if (signature) {
        const transactionData = {
          id: Date.now().toString(),
          amount: amount,
          createDate: Date.now(),
          receiver: "Chiêm Nguyễn Trí Nguyên",
          receiver_payment_number:
            "FPVqjQo9hpf4mFUjMk1KBtxNXYjoLeiyL4vwp3VsNWii",
          txig: signature,
          paymentInfo: paymentInfoData,
          wallet: walletData,
        };
        createTransaction(transactionData)
          .then((data) => {
            walletData.balance = walletData.balance + amount;

            console.log(walletData.balance);
            console.log(walletData.id);
            console.log("Tạo giao dịch thành công:", data);
            updateWallet(walletData.id, walletData)
              .then((data) => {
                console.log("Cập nhật số dư thành công:", data);
                setBalance(walletData.balance);
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
      case "Momo":
        try {
          const data = await getMOMODeposite(1, amount);
          console.log(data);
          window.location.href = data.URL; // Navigate to the payment URL
        } catch (error) {
          console.error("Error:", error);
        }
        break;
      case "Vnpay":
        try {
          const data = await getVNPayDeposite(1, amount);
          console.log(data);
          window.location.href = data.URL; // Navigate to the payment URL
        } catch (error) {
          console.error("Error:", error);
        }
        break;
      case "Solana":
        if(!account || !amount){
          toast.error("Tài khoản chưa đăng nhập hoặc không đủ số dư");
        }else{
          handleTransaction();
        }
        break;
      default:
        alert("Chỉ hỗ trợ thanh toán Momo, Vnpay, Solana");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75">
          <div className="relative p-4 w-full max-w-2xl h-full top-12">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-full overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Modal title
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onClose}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="flex p-4">
                <div className="left-panel w-1/2 pr-4">
                  <h6 className="text-lg font-medium">Ngân hàng</h6>
                  <div className="payment-options flex space-x-2 mt-2">
                    <img
                      src="assets/img/eth.jpg"
                      alt="ETH"
                      className="option cursor-pointer h-[80px] w-[80px]"
                      onClick={() => handlePaymentSelect("Eth")}
                    />
                    <img
                      src="assets/img/atm.jpg"
                      alt="ATM"
                      className="option cursor-pointer h-[80px] w-[80px]"
                      onClick={() => handlePaymentSelect("Atm")}
                    />
                    <img
                      src="assets/img/vnpay.jpg"
                      alt="VNPay"
                      className="option cursor-pointer h-[80px] w-[80px]"
                      onClick={() => handlePaymentSelect("Vnpay")}
                    />
                  </div>
                  <h6 className="text-lg font-medium mt-4">Tiền điện tử</h6>
                  <div className="payment-options flex space-x-2 mt-2">
                    <img
                      src="assets/img/momo.jpg"
                      alt="MOMO"
                      className="option cursor-pointer h-[80px] w-[80px]"
                      onClick={() => handlePaymentSelect("Momo")}
                    />
                    <img
                      src="assets/img/btc.jpg"
                      alt="BTC"
                      className="option cursor-pointer h-[80px] w-[80px]"
                      onClick={() => handlePaymentSelect("Bitcoin")}
                    />
                    <img
                      src="assets/img/solana.jpg"
                      alt="Solana"
                      className="option cursor-pointer h-[80px] w-[80px]"
                      onClick={() => handlePaymentSelect("Solana")}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="customAmount">Số tiền muốn nạp</label>
                    <input
                      type="text"
                      className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                      id="customAmount"
                      value={amount.toLocaleString("vi-VN")}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Tối thiểu 50.000đ"
                    />
                  </div>
                  <p className="mt-3">
                    Bạn nhận được:{" "}
                    <span>{Number(amount).toLocaleString("vi-VN")} đ</span>
                  </p>
                  <p>
                    Số tiền nạp tối thiểu: <span>50.000đ</span>
                  </p>
                </div>
                <div className="right-panel w-1/2 overflow-y-auto max-h-[400px]">
                  {selectedPayment === "visa" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua VISA
                      </h6>
                      <div className="form-group mt-2">
                        <label htmlFor="visaCardNumber">Số thẻ</label>
                        <input
                          type="text"
                          className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                          id="visaCardNumber"
                          placeholder="Nhập số thẻ"
                        />
                      </div>
                      <div className="form-group mt-2">
                        <label htmlFor="accountName">Tên chủ thẻ</label>
                        <input
                          type="text"
                          className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                          id="accountName"
                          placeholder="Nhập tên chủ thẻ"
                        />
                      </div>
                      <div className="form-group mt-2">
                        <label htmlFor="visaExpiryDate">Ngày phát hành</label>
                        <input
                          type="text"
                          className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                          id="visaExpiryDate"
                          placeholder="MM/YY"
                        />
                      </div>
                    </form>
                  )}
                  {selectedPayment === "Atm" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua Ngân hàng NCB
                      </h6>
                    </form>
                  )}
                  {selectedPayment === "Vnpay" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua VNPay
                      </h6>          
                    </form>
                  )}
                  {selectedPayment === "Momo" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua Momo
                      </h6>
                    </form>
                  )}
                  {selectedPayment === "Bitcoin" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua Bitcoin
                      </h6>
                    </form>
                  )}
                  {selectedPayment === "Eth" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua Ethereum
                      </h6>
                    </form>
                  )}
                  {selectedPayment === "Solana" && (
                    <form>
                      <h6 className="text-lg font-medium">
                        Thanh toán qua Solana
                      </h6>
                    </form>
                  )}
                  <div className="amount-selection mt-3">
                    <ul className="space-y-2">
                      {[
                        100000, 200000, 300000, 500000, 1000000, 2000000,
                        3000000, 5000000,
                      ].map((amount) => (
                        <li key={amount}>
                          <div
                            className={`amount-option p-2 border rounded cursor-pointer ${
                              selectedAmount === amount
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            }`}
                            onClick={() => setSelecterdCustomAmount(amount)}
                          >
                            {amount.toLocaleString("vi-VN")} đ
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-gray-900 bg-white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 
                  font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none
                   dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => deposite(amount, selectedPayment)}
                >
                  Nạp tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default Modal;
