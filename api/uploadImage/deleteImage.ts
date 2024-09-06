export async function deleteImage(id) {
  try {
    const response = await fetch(
      `http://localhost:8080/cloudinary/delete/${id}`,
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
