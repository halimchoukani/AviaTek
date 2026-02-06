import { Query } from "appwrite";
import { appwriteConfig, databases } from "../appwrite";

import { Simulator } from "../types";

export const getSimulators = async (): Promise<Simulator[]> => {
    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            "simulators",
            [
                Query.orderDesc("$createdAt"),
            ]
        );
        return result.documents as unknown as Simulator[];
    } catch (error) {
        console.error("Error fetching simulators:", error);
        throw error;
    }
};
