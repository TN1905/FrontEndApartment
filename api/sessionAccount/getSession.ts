export async function getSessionAccount(accountId) {
  try {
    let response = await fetch(
      `http://localhost:8080/sessionAccount/${accountId}`
    );

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse the JSON
    let data = await response.json();

    return data;
  } catch (error) {
    console.error("Get Session Failed:", error);
    // Return null or some error object to indicate failure
    return null;
  }
}
