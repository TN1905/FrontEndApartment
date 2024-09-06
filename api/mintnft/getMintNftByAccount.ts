export async function getMintNftByAccount(accountId) {
  let response = await fetch(`http://localhost:8080/rest/mintnft/${accountId}`);
  let data = await response.json();
  return data;
}
