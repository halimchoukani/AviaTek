import { Account, Avatars, Client, Databases, ID, Query, Teams } from "appwrite";

export const appwriteConfig = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "com.jsm.aviatek",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "",
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
    pilotCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PILOT_COLLECTION_ID ?? "",
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID ?? "",
};

const client = new Client()
    .setProject(appwriteConfig.projectId)
    .setEndpoint(appwriteConfig.endpoint);

export const databases = new Databases(client);
export const account = new Account(client);
export const teams = new Teams(client);
export const avatars = new Avatars(client);

export default client;

export async function createUser(email: string, password: string, username: string) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email: string, password: string) {
    try {
        // Attempt to delete current session if exists - clean slate
        try {
            await account.deleteSession('current');
        } catch (e) {
            // Ignore if no session
        }

        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser.documents.length) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
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
