export async function getFavorites(account_id : number,apartment_id : string) {
  try {
    let response = await fetch(
      `http://localhost:8080/rest/favorites?account_id=${account_id}&apartment_id=${apartment_id}`
    );

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse the JSON
    let data = await response.json();

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    // Return null or some error object to indicate failure
    return null;
  }
}
