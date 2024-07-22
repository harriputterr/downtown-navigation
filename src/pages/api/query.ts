import { NextApiRequest, NextApiResponse } from "next";
import { read, write } from "../../lib/neo4j";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, params, type } = req.body;

  try {
    let result;
    if (type === "read") {
      result = await read(query, params);
    } else if (type === "write") {
      result = await write(query, params);
    } else {
      throw new Error("Invalid query type");
    }
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}


