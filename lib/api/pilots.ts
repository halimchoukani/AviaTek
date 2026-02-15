import { ID, Query } from "react-native-appwrite";
import { account, appwriteConfig, databases } from "../appwrite";
import { PilotActivityStatus, PilotDocument, PilotStatus } from "../types";
import { signIn } from "./auth";


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
export const getPilotsNotAssignedToAcademy = async () => {
    try {
        const result = await databases.listDocuments<PilotDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            [
                Query.isNull('academy'),
                Query.orderDesc('$createdAt')
            ]
        );
        return result.documents;
    } catch (error) {
        console.error('Error fetching pilots:', error);
        throw error;
    }
}
export const getPilots = async () => {
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


export const assignPilotToAcademy = async (pilotId: string) => {
    try {
        const result = await databases.updateDocument<PilotDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            pilotId,
            {
                academy: "Academy1"
            }
        );
        return result;
    } catch (error) {
        console.error('Error adding pilot to academy:', error);
        throw error;
    }
}


export async function registerPilot(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    licenseNumber: string,
) {
    try {
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            fullName,
        );


        if (!newAccount) throw Error;

        const newPilot = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            newAccount.$id,
            {
                name: firstName.trim(),
                lastname: lastName.trim(),
                email: email,
                phone: phone,
                licenseNumber: licenseNumber || "N/A",
                flightHours: 0,
                rank: licenseNumber.slice(0, licenseNumber.indexOf("-")).toUpperCase(),
                status: PilotStatus.Online,
                activeStatus: PilotActivityStatus.Active,
                dateOfBirth: new Date().toISOString(),
                isVerified: false
            }
        );

        await signIn(email, password);
        await account.updatePrefs({
            role: "pilot"
        });
        await account.updatePhone(
            phone,
            password
        );
        return newPilot;
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}
