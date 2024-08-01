import { queryDB } from "@/app/refactor/components/QueryDB";

interface Node {
    name: string;
    uuid: string;
    point: {
        x: number;
        y: number;
        z: number;
    };
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
