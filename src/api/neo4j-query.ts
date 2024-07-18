import { getSession, closeDriver } from "../lib/neo4j"
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSession();

  try {
    
    const result = await session.run(`MATCH (n) RETURN n;`);
    const record = result.records.map((record) => record.get(0));

    console.log(record);
    res.status(200).json({ data: record });

  } catch (error) {
    res.status(500).json({ error });
  } finally {
    await session.close();
  }
}
