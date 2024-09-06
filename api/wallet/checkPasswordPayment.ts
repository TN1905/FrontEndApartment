export async function checkPasswordPayment(walletId, passwordPayment) {
  try {
    // Construct the URL with the query parameters
    const url = `http://localhost:8080/rest/checkPasswordPayment/${walletId}?passwordPayment=${passwordPayment}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse the JSON
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    // Return null or some error object to indicate failure
    return null;
  }
}
