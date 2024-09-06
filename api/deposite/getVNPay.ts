export async function getVNPayDeposite(walletId, amount) {
  try {
    let response = await fetch(
      `http://localhost:8080/rest/deposite_vnpay?walletId=${walletId}&amount=${amount}`
    );

    if (!response.ok) {
      console.error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch VNPay deposit:", error.message);
    throw error;
  }
}
