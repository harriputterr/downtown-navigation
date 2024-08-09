interface QueryDBParams {
    query: string;
    type: "read" | "write";
    params?: { [key: string]: any };
}

export async function queryDB({ query, type, params }: QueryDBParams) {
    const response = await fetch("/api/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: query,
            type: type,
            params: params,
        }),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result;
}
