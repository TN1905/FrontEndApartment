export async function getApartmentImage(id) {
  try {
    let response = await fetch(`http://localhost:8080/cloudinary/${id}`);

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
