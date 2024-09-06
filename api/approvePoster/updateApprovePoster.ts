export async function updateApprovePoster(approvePosterId, approveData) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/updateApprovePoster/${approvePosterId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({approveData}),
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
