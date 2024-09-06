export async function getTransactionByAccount(walletId) {
  try {
    let response = await fetch(
      `http://localhost:8080/rest/wallettransaction/${walletId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTransactionByAccount:", error);
    return [];
  }
}


export async function getAllTranSaction() {
  try {
    let response = await fetch(`http://localhost:8080/rest/wallettransaction`);
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTransactionByAccount:", error);
    return [];
  }
}