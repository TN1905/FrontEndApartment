export async function loadLocation() {
  let response = await fetch(
    "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json?fbclid=IwAR0rFIXdhDePPDSI5SeQZarnl_UazlS2REGaXelLWT74AGV9DEpjHlXKGdY"
  );
  let data = await response.json();
  return data;
}
