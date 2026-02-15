import { ID } from "react-native-appwrite";
import { account, appwriteConfig, avatars, databases } from "../appwrite";


export async function signIn(email: string, password: string) {
    try {
        try {
            await account.deleteSession('current');
        } catch (e) {
            console.log(e);
        }

        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function createUser(email: string, password: string, username: string) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error("Failed to create account");

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