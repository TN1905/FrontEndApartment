import React, {useState} from "react";

const WalletPage = () => {
  return (
    <div className=" w-full h-[90vh] items-center justify-center">
      <main>
        <div>
          <h1 className="text-2xl font-bold">Lịch sử giao dịch</h1>
          <div className="mb-3 mt-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full sm:w-1/4 px-2 mb-3 sm:mb-0">
                <input type="date" className="w-full border rounded-md p-2" />
              </div>
              <div className="w-full sm:w-1/4 px-2">
                <input type="date" className="w-full border rounded-md p-2" />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex">
              <div className="mr-2">
                <button type="submit" className="btn btn-custom">
                  Tất cả
                </button>
              </div>
            </div>
          </div>
          <section className="section">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full px-2">
                <div className="bg-white shadow-md rounded">
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2">Thời gian</th>
                            <th className="border px-4 py-2">Mã giao dịch</th>
                            <th className="border px-4 py-2">Tin rao</th>
                            <th className="border px-4 py-2">Loại giao dịch</th>
                            <th className="border px-4 py-2">Số tiền (đ)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2">1</td>
                            <td className="border px-4 py-2">2</td>
                            <td className="border px-4 py-2">3</td>
                            <td className="border px-4 py-2">4</td>
                            <td className="border px-4 py-2">5</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="py-5 text-sm transition-all duration-300 border-t border-[#cddfff] text-center">
        <div className="items-center text-[#012970]">
          &copy; Copyrights
          <strong>
            <span> Poster</span>
          </strong>
          . All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default WalletPage;