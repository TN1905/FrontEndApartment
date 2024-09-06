export async function updateSessionAccount(
  accountId: number,
  session: string,
  expires: number
) {
  try {
    const response = await fetch("http://localhost:8080/rest/sessionAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
        session,
        expires,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update Session:", error);
    return null;
  }
}
