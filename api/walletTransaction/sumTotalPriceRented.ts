export async function sumTotalPriceRented() {
  try {
    let response = await fetch(`http://localhost:8080/rest/totalrented`);
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in totalrented:", error);
    return [];
  }
}
