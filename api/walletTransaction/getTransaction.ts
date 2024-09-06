export async function getTransactionOne(transactionId) {
  let response = await fetch(
    `http://localhost:8080/rest/wallettransaction/${transactionId}`
  );
  if (response.ok) {
    // Giao dịch tồn tại
    return true;
  } else {
    // Giao dịch không tồn tại
    return false;
  }
}
