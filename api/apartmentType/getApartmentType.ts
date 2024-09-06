export async function getAllApartmentType() {
  let response = await fetch("http://localhost:8080/rest/aparttypes");
  let data = await response.json();
  return data;
}
