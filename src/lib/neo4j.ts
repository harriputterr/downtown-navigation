import neo4j from 'neo4j-driver'

// Ensuring environment variables are defined
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

if (!NEO4J_URI || !NEO4J_PASSWORD || !NEO4J_USER){
    throw new Error('Missing required environment variables for NEO4J')
}

const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

export const getSession = () => driver.session();
export const closeDriver = async () => await driver.close()