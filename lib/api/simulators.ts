import { Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "../appwrite";

import { Simulator } from "../types";

export const getSimulators = async (academyId: string): Promise<Simulator[]> => {
    try {
        const queries = [Query.orderDesc("$createdAt")];

        // Only filter by academy if academyId is provided
        if (academyId) {
            queries.push(Query.equal("academy", academyId));
        }

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.simulatorCollectionId,
            queries
        );
        return result.documents as unknown as Simulator[];
    } catch (error: any) {
        if (error.message?.includes("Attribute not found in schema: academy")) {
            console.error("CRITICAL: The 'academy' attribute is missing in the simulators collection schema. Please add it in Appwrite console.");
            // Temporary fallback during development: try fetching without the academy filter
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.simulatorCollectionId,
                [Query.orderDesc("$createdAt")]
            );
            return result.documents as unknown as Simulator[];
        }
        console.error("Error fetching simulators:", error);
        throw error;
    }
};
export const createSimulator = async (simulator: Omit<Simulator, "$id">): Promise<Simulator> => {
    try {
        const result = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.simulatorCollectionId,
            "unique()",
            simulator
        );
        return result as unknown as Simulator;
    } catch (error) {
        console.error("Error creating simulator:", error);
        throw error;
    }
};
