export async function getPendingApartments (){
    const response = await fetch('http://localhost:8080/apartments/pending');
    const data = await response.json();
    return data;
  };
