export async function getListUsers() {
  let response = await fetch("http://localhost:8080/rest/accounts");
  let data = await response.json();
  return data;
}
