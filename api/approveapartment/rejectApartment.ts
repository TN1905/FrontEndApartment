export async function rejectApartment(apartmentId) {
  try {
    const response = await fetch(`http://localhost:8080/apartments/reject/${apartmentId}`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error('Failed to reject apartment');
    }
    return response.json();
  } catch (error) {
    console.error("Error during rejection:", error);
    return null;
  }
};
