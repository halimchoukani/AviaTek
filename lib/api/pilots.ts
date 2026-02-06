import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../appwrite";
import { Pilot, PilotDocument } from "../types";

export const getPilotsByAcademy = async (academy: string = "Academy1") => {
    try {
        const result = await databases.listDocuments<PilotDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            [
                Query.equal('academy', academy),
                Query.orderDesc('$createdAt')
            ]
        );
        return result.documents;
    } catch (error) {
        console.error('Error fetching pilots:', error);
        throw error;
    }
};
export const getPilots = async ()=>{
    try {
        const result = await databases.listDocuments<PilotDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            [
                Query.orderDesc('$createdAt')
            ]
        );
        return result.documents;
    } catch (error) {
        console.error('Error fetching pilots:', error);
        throw error;
    }
}
export const createPilot = async (pilot: Pilot) => {
    try {
        const result = await databases.createDocument<PilotDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            ID.unique(),
            pilot
        );
        return result;
    } catch (error) {
        console.error('Error creating pilot:', error);
        throw error;
    }
}
