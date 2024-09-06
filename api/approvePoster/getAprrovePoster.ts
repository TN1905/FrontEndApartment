export async function getApprovePoster() {
  let response = await fetch("http://localhost:8080/rest/getApprove");
  let data = await response.json();
  return data;
}
