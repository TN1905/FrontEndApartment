export async function getAllRentedApartments(accountId) {
    try {
        const response = await fetch(
          `http://localhost:8080/rest/getallrentedapartments/${accountId}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all rented apartments:", error);
        return [];
    }
}