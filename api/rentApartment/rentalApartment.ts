export async function getApartmentRent() {
    try {
      const response = await fetch('http://localhost:8080/rest/expired');
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
