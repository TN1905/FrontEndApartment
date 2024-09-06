import React, {useState} from "react";

const DepositeTransaction = () => {
  return (
    <div className=" w-full h-[90vh] items-center justify-center">
      <main>
        <div>
          <h1 className="text-2xl font-bold">Lịch sử nạp tiền</h1>
          <div class="flex flex-wrap mb-6">
            <div class="w-full md:w-1/4 mb-4 md:mb-0 px-2">
              <input
                type="date"
                class="form-input w-full border-gray-300 rounded-md shadow-sm bg-slate-100"
              />
            </div>
            <div class="w-full md:w-1/4 mb-4 md:mb-0 px-2">
              <input
                type="date"
                class="form-input w-full border-gray-300 rounded-md shadow-sm bg-slate-100"
              />
            </div>
            <div class="w-full md:w-1/4 mb-4 md:mb-0 px-2">
              <select class="form-select w-full border-gray-300 rounded-md shadow-sm bg-slate-100">
                <option selected>Phương thức thanh toán</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="w-full md:w-1/4 px-2">
              <select class="form-select w-full border-gray-300 rounded-md shadow-sm bg-slate-100">
                <option selected>Trạng thái</option>
                <option value="1">Thành công</option>
                <option value="2">Thất bại</option>
              </select>
            </div>
          </div>

          <div class="mb-6">
            <button
              type="submit"
              class="btn btn-custom bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Tất cả
            </button>
          </div>
          <section class="section">
            <div class="row">
              <div class="col-lg-12">
                <div class="card bg-white rounded-lg shadow-md">
                  <div class="card-body p-4">
                    <div class="table-responsive">
                      <table class="table-auto w-full text-left border-collapse border border-gray-200">
                        <thead>
                          <tr class="bg-gray-100">
                            <th class="px-4 py-2 border border-gray-300">
                              Mã giao dịch
                            </th>
                            <th class="px-4 py-2 border border-gray-300">
                              Thời gian
                            </th>
                            <th class="px-4 py-2 border border-gray-300">
                              Số tiền nhận
                            </th>
                            <th class="px-4 py-2 border border-gray-300">
                              Phương thức thanh toán
                            </th>
                            <th class="px-4 py-2 border border-gray-300">
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="px-4 py-2 border border-gray-300">1</td>
                            <td class="px-4 py-2 border border-gray-300">2</td>
                            <td class="px-4 py-2 border border-gray-300">3</td>
                            <td class="px-4 py-2 border border-gray-300">4</td>
                            <td class="px-4 py-2 border border-gray-300">5</td>
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
};

export default DepositeTransaction;