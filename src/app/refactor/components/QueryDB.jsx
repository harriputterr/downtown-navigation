export async function queryDB({ query, type }) {
  try {

    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        type: type,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result;

  } catch (error) {
    console.log(error);
  }
}
