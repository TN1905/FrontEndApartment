export async function getListApartment() {
  let response = await fetch("http://localhost:8080/rest/apartments");
  let data = await response.json();
  return data;
}
