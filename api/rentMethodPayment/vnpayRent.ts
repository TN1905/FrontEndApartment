export async function vnpayRent(walletId, amount, month) {
  try {
    let response = await fetch(
      `http://localhost:8080/rest/create_payment_vnpay?walletId=${walletId}&amount=${amount}&month=${month}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.ok) {
      console.error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    if (data.status === "OK") {
      // Redirect to the payment URL
      window.location.href = data.URL;
    } else {
      console.error("Failed to initiate payment:", data.message);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch VNPAY deposit:", error.message);
    throw error;
  }
}


