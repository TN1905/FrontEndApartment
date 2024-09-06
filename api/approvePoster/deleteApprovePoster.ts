export async function deleteApprove(approveId) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/deleteApprovePoster/${approveId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete favorite");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
