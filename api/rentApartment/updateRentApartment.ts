export async function updateRentApartment(apartmentId, months) {
    try {
        const response = await fetch(`http://localhost:8080/rest/rentapartments/updateEndDate/${apartmentId}?months=${months}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // ném lại lỗi để xử lý phía trên
    }
}
