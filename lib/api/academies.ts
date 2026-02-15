import { ID } from "react-native-appwrite";
import { account, appwriteConfig, databases, teams } from "../appwrite";
import { signIn } from "./auth";

interface RegisterAcademyParams {
    name: string;
    country: string;
    city: string;
    address: string;
    email: string;
    phone: string;
    website?: string;
    adminName: string;
    adminEmail: string;
    password: string;
}

export async function registerAcademy(params: RegisterAcademyParams) {
    const {
        name,
        country,
        city,
        address,
        email,
        phone,
        website,
        adminName,
        adminEmail,
        password,
    } = params;

    try {
        // 1️⃣ Create user
        const user = await account.create(
            ID.unique(),
            adminEmail,
            password,
            adminName
        );

        // 2️⃣ Create session
        await signIn(adminEmail, password);

        // 3️⃣ Create academy document
        const orgId = ID.unique();

        const academy = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.academyCollectionId,
            orgId,
            {
                name,
                country,
                city,
                address,
                contactEmail: email,
                phoneNumber: phone,
                website,
                isVerified: false,
            }
        );

        // 4️⃣ Create team (creator automatically owner)
        await teams.create(orgId, name);

        // 5️⃣ Update user prefs
        await account.updatePrefs({
            role: "academy",
            academyId: orgId,
        });

        return academy;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getAcademyById(id: string) {
    try {
        const academy = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.academyCollectionId,
            id
        );
        return academy;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}
export const getAcademyAdmins = async () => {
    try {
        const currentAccount = await account.get();

        const teamId = currentAccount.prefs.academyId;

        if (!teamId) {
            throw new Error("User has no academyId in prefs");
        }

        const result = await teams.listMemberships(teamId);

        const adminMembers = result.memberships.filter(
            (membership) =>
                membership.roles.includes("admin") ||
                membership.roles.includes("owner")
        );

        const admins = adminMembers.map(m => ({
            userId: m.userId,
            userEmail: m.userEmail,
            roles: m.roles,
            userName: m.userName,
        }));
        console.log(admins);
        return admins;

    } catch (error) {
        console.error("Error fetching admins:", error);
        throw error;
    }
};


