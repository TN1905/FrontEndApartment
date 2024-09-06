export async function getMessageUsers(id) {
  let response = await fetch(`http://localhost:8080/rest/messageuser/${id}`);
  let data = await response.json();
  return data;
}
