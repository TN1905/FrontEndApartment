export async function updateUser(accountid, user) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/accounts/${accountid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update User Fail:", error);
    return null;
  }
}

export async function updateAccount(accountid, user) {
  try {
    const response = await fetch(
      `http://localhost:8080/rest/updateAccount/${accountid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update User Fail:", error);
    return null;
  }
}
