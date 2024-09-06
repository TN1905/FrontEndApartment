export async function createMessageUser(message) {
  try {
    const response = await fetch(`http://localhost:8080/rest/messageuser`, {
      method: "POST",
      body: JSON.stringify(message), // Không cần bọc transaction trong một đối tượng khác
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Kiểm tra nếu phản hồi là JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Phản hồi không phải là JSON");
    }

    const data = await response.json();

    // Kiểm tra phản hồi có nội dung hay không
    if (Object.keys(data).length === 0) {
      throw new Error("Phản hồi trống");
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error("Lỗi tạo message users:", error.message);
    throw error;
  }
}
