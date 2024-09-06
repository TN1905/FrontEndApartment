export async function uploadImage(file, apartmentId) {
  const formData = new FormData();
  formData.append("multipartFile", file);
  formData.append("apartmentId", apartmentId);

  try {
    const response = await fetch(`http://localhost:8080/cloudinary/upload`, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new TypeError(`Phản hồi không phải là JSON: ${text}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
}
