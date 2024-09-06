export async function getWallet(id) {
  let response = await fetch(`http://localhost:8080/rest/wallet/${id}`);
  let data = await response.json();
  return data;
}
