import { ID } from "react-native-appwrite";
import { account, appwriteConfig, databases } from "../appwrite";
import { signIn } from "./auth";

interface RegisterAcademyParams {
    name: string;
    type: string;
    country: string;
    city: string;
    address: string;
    certifications: string[];
    email: string;
    phone: string;
    website?: string;
    adminName: string;
    adminEmail: string;
    password: string;
}

export async function registerAcademy({
    name,
    type,
    country,
    city,
    address,
    certifications,
    email,
    phone,
    website,
    adminName,
    adminEmail,
    password,
}: RegisterAcademyParams) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            adminEmail,
            password,
            adminName,
        );

        if (!newAccount) throw Error;

        const newAcademy = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.academyCollectionId,
            newAccount.$id,
            {
                name,
                type,
                country,
                city,
                address,
                certifications,
                email, // Organization email
                phone,
                website,
                adminName,
                adminEmail, // Admin/Login email
                isVerified: false,
            }
        );

        await signIn(adminEmail, password);
        await account.updatePrefs({
            role: "academy"
        });

        return newAcademy;
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}
