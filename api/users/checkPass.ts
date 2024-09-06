export async function checkPass(email, password) {
  try {
    let response = await fetch(
      `http://localhost:8080/rest/checkPass?username=${email}&password=${password}`
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
