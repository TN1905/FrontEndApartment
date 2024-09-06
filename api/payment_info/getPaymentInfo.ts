export async function getPaymentInfo() {
  let response = await fetch("http://localhost:8080/rest/paymentinfo/1");
  let data = await response.json();
  return data;
}
