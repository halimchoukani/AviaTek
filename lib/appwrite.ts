import { Account, Avatars, Client, Databases, Query, Teams } from "react-native-appwrite";

export const appwriteConfig = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "com.jsm.aviatek",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "",
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
    pilotCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PILOT_COLLECTION_ID ?? "",
    academyCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ACADEMY_COLLECTION_ID ?? "",
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID ?? "",
};

const client = new Client()
    .setProject(appwriteConfig.projectId)
    .setEndpoint(appwriteConfig.endpoint)
    .setPlatform(appwriteConfig.platform);

export const databases = new Databases(client);
export const account = new Account(client);
export const teams = new Teams(client);
export const avatars = new Avatars(client);

export default client;



export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.pilotCollectionId,
            [Query.equal('$id', currentAccount.$id)]
        );

        if (!currentUser.documents.length) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log("Error getting current user session:", error);
        return null;
    }
}
export async function getCurrentUserRole(): Promise<string | null> {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        return currentAccount.prefs.role;
    } catch (error) {
        console.log("Error getting user role:", error);
        return null;
    }
}
export async function signOut() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error: any) {
        throw new Error(error);
    }
}


