import neo4j from "neo4j-driver";

// Ensuring environment variables are defined

const { NEO4J_URI, NEO4J_PASSWORD, NEO4J_USER } = process.env;

if (!NEO4J_URI || !NEO4J_PASSWORD || !NEO4J_USER) {
  throw new Error("Missing Environment Variables for Neo4j");
}

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

export async function read(cypher: string, params = {}) {
  // Opening a session
  const session = driver.session();

  try {
    // Excecute a Cypher Statement
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    // Prcocess the results
    const values = res.records.map((record) => record.toObject());

    return values;

  } catch (error) {

    console.log(error);

  } finally {

    await session.close();

  }
}

export async function write(cypher: string, params = {}) {
  const session = driver.session();

  try {
    const res = await session.executeWrite((tx) => tx.run(cypher, params));

    const values = res.records.map((record) => record.toObject());

    return values;

  } finally {

    await session.close();
    
  }
}
