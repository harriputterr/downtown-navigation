import { queryDB } from "@/app/refactor/components/QueryDB";

interface Node {
    name: string;
    uuid: string;
    point: {
        x: number;
        y: number;
        z: number;
    };
    image: string;
}

interface ResultProps {
    data: { n: { properties: Node } }[];
}

export const getAllNodes = async (): Promise<ResultProps> => {
    try {
        const result = await queryDB({
            query: "Match (n) return (n);",
            type: "read",
        });
        return result as ResultProps;
    } catch (error) {
        console.error("Error fetching node by UUID:", error);
        throw error;
    }
};

export const getShortestPathNodes = async ({
    from,
    to,
}: {
    from: string;
    to: string;
}) => {
    const query = `
      MATCH (startNode:Node {name: $start}), (endNode:Node {name: $stop})
      MATCH path = shortestPath((startNode)-[*]-(endNode))
      RETURN nodes(path) AS pathNodes;
    `;
    const result = await queryDB({
        query,
        type: "read",
        params: { start: from, stop: to },
    });

    if (result.data) {
        return result.data[0].pathNodes.map((node: any) => node.properties);
    }
    return [];
};
