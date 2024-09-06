export async function updateApartment(apartmentId, apartment) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/apartments/${apartmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apartment),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update User Fail:", error);
    return null;
  }
}

export async function updateApartment1(apartmentId, apartment) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/report/${apartmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apartment),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update User Fail:", error);
    return null;
  }
}

export async function updateApartment2(apartmentId, apartment) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/updateapartment/${apartmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apartment),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update User Fail:", error);
    return null;
  }
}