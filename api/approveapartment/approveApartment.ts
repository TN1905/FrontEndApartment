export async function approveApartment(apartmentId) {
  try {
  const response = await fetch(`http://localhost:8080/apartments/approve/${apartmentId}`, {
    method: "PUT",
  });
  if (!response.ok) {
    throw new Error('Failed to approve apartment');
  }
  return response.json();
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};
