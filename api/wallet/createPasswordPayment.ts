export async function createPasswordPayment(walletId, passwordPayment) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/passwordpayment/${walletId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: passwordPayment,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update User Fail:", error);
    return null;
  }
}
