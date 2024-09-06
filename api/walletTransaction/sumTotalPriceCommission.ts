export async function sumTotalPriceCommission() {
  try {
    let response = await fetch(`http://localhost:8080/rest/totalcommission`);
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in totalcommission:", error);
    return [];
  }
}
