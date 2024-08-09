import { queryDB } from "./QueryDB";

export const getNodeByUUID = async (uuid) => {
  const query = `
    MATCH (n:Node { uuid: $uuid })
    RETURN n
  `;
  const params = { uuid };

  try {
    const result = await queryDB({ query, type: "read", params });
    return result;
  } catch (error) {
    console.error("Error fetching node by UUID:", error);
    throw error;
  }
};
