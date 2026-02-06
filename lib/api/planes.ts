import { Query } from "appwrite";
import { appwriteConfig, databases } from "../appwrite";

import { Plane } from "../types";

export const getPlanes = async (): Promise<Plane[]> => {
    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            "equipment",
            [
                Query.orderAsc("$createdAt"),
            ]
        );
        return result.documents as unknown as Plane[];
    } catch (error) {
        console.error("Error fetching planes:", error);
        throw error;
    }
};
