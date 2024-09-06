export async function getListApartmentByAccount(accountId) {
  let response = await fetch(
    `http://localhost:8080/rest/apartmentAccountId/${accountId}`
  );
  let data = await response.json();
  return data;
}
