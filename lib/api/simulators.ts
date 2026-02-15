import { Query } from "react-native-appwrite";
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
export const createSimulator = async (simulator: Omit<Simulator, "$id">): Promise<Simulator> => {
    try {
        const result = await databases.createDocument(
            appwriteConfig.databaseId,
            "simulators",
            "unique()",
            simulator
        );
        return result as unknown as Simulator;
    } catch (error) {
        console.error("Error creating simulator:", error);
        throw error;
    }
};
