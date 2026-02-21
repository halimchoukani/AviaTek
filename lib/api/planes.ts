import { Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "../appwrite";

import { Plane } from "../types";

export const getPlanes = async (academyId: string): Promise<Plane[]> => {
    try {
        const queries = [Query.orderAsc("$createdAt")];

        // Only filter by academy if academyId is provided
        if (academyId) {
            queries.push(Query.equal("academy", academyId));
        }

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.equipmentCollectionId,
            queries
        );
        return result.documents as unknown as Plane[];
    } catch (error: any) {
        if (error.message?.includes("Attribute not found in schema: academy")) {
            console.error("CRITICAL: The 'academy' attribute is missing in the equipment collection schema. Please add it in Appwrite console.");
            // Temporary fallback during development: try fetching without the academy filter
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.equipmentCollectionId,
                [Query.orderAsc("$createdAt")]
            );
            return result.documents as unknown as Plane[];
        }
        console.error("Error fetching planes:", error);
        throw error;
    }
};
export const createPlane = async (plane: Omit<Plane, "$id">): Promise<Plane> => {
    try {
        const result = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.equipmentCollectionId,
            "unique()",
            plane
        );
        return result as unknown as Plane;
    } catch (error) {
        console.error("Error creating plane:", error);
        throw error;
    }
};
