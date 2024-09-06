export async function addPaymentMethod(payment) {
  try {
    const response = await fetch(`http://localhost:8080/rest/paymentinfo`, {
      method: "POST",
      body: JSON.stringify(payment),
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
    console.error("Tạo tài khoản thất bại:", error.message);
    throw error;
  }
}
