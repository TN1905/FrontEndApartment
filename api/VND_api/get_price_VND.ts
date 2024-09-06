export async function getVNDPrice() {
  let response = await fetch("http://localhost:8080/api/exchange-rate");
  let data = await response.json();
  return data;
}
