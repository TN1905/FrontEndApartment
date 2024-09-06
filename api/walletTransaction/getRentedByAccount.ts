// api/walletTransaction/getPriceRentedByMonth.js
export async function getRentedByAccount(walletId) {
  const response = await fetch(
    `http://localhost:8080/rest/totalrentedbyaccount/${walletId}`
  );
  if (response.ok) {
    const data = await response.json();
    return data; // giả sử API trả về { "amount": giá_trị }
  }
}
