export async function checkBronze(accountId) {
  let response = await fetch(
    `http://localhost:8080/rest/rankbronze/${accountId}`
  );
  let data = await response.json();
  return data;
}

export async function checkSilver(accountId) {
  let response = await fetch(
    `http://localhost:8080/rest/ranksilver/${accountId}`
  );
  let data = await response.json();
  return data;
}

export async function checkGold(accountId) {
  let response = await fetch(
    `http://localhost:8080/rest/rankgold/${accountId}`
  );
  let data = await response.json();
  return data;
}

export async function checkPlatinum(accountId) {
  let response = await fetch(
    `http://localhost:8080/rest/rankplatinum/${accountId}`
  );
  let data = await response.json();
  return data;
}

export async function checkDiamond(accountId) {
  let response = await fetch(
    `http://localhost:8080/rest/rankdiamond/${accountId}`
  );
  let data = await response.json();
  return data;
}
