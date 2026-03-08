import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "../appwrite";
import { Notification, NotificationDocument } from "../types";

export const createNotification = async (notificationData: Notification) => {
    try {

        const notification = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            ID.unique(),
            notificationData,
        );
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
}

export const getNotifications = async (userId: string): Promise<NotificationDocument[]> => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
        );
        return response.documents as unknown as NotificationDocument[];
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}
