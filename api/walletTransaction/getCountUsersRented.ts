export async function totalCountUsersRented() {
  try {
    let response = await fetch(`http://localhost:8080/rest/totalusersrented`);
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in totalCountUsersRented:", error);
    return [];
  }
}
