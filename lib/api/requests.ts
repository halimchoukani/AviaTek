import { ID, Permission, Query, Role } from "react-native-appwrite";

import { appwriteConfig, databases } from "../appwrite";
import { Request as PilotRequest, RequestDocument, RequestStatus } from "../types";

/**
 * Sends a training request from a pilot to an academy.
 * @param requestData The request details (pilotId, academyId, equipmentId, note, startDate, hours)
 */
export const sendRequest = async (requestData: Omit<PilotRequest, "$id" | "status">) => {

    try {
        const result = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.requestCollectionId,
            ID.unique(),
            {
                ...requestData,
                status: RequestStatus.Pending,
            },
            [
                Permission.update(Role.team(requestData.academyId)),
                Permission.delete(Role.team(requestData.academyId)),
                Permission.update(Role.user(requestData.pilotId)),
                Permission.delete(Role.user(requestData.pilotId)),
            ]

        );
        return result;
    } catch (error) {
        console.error("Error sending training request:", error);
        throw error;
    }
};


/**
 * Enriches training requests with pilot and equipment details.
 */
const enrichRequestsWithDetails = async (requests: any[]): Promise<any[]> => {
    if (requests.length === 0) return [];

    try {
        const pilotIds = [...new Set(requests.map((r) => r.pilotId).filter(id => !!id))];
        const equipmentIds = [...new Set(requests.map((r) => r.equipmentId).filter(id => !!id))];

        // Fetch Pilots
        let pilotMap = new Map();
        if (pilotIds.length > 0) {
            const pilotsResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.pilotCollectionId,
                [Query.equal("$id", pilotIds)]
            );
            pilotMap = new Map(pilotsResponse.documents.map((p) => [p.$id, p]));
        }

        // Fetch Equipment (Planes and Simulators)
        const equipmentMap = new Map();

        if (equipmentIds.length > 0) {
            const [planesResponse, simulatorsResponse] = await Promise.all([
                databases.listDocuments(appwriteConfig.databaseId, "equipment", [
                    Query.equal("$id", equipmentIds),
                ]).catch(() => ({ documents: [] })),
                databases.listDocuments(appwriteConfig.databaseId, "simulators", [
                    Query.equal("$id", equipmentIds),
                ]).catch(() => ({ documents: [] })),
            ]);

            planesResponse.documents.forEach((p) =>
                equipmentMap.set(p.$id, { name: (p as any).name || (p as any).modelNumber })
            );
            simulatorsResponse.documents.forEach((s) =>
                equipmentMap.set(s.$id, { name: (s as any).simulatorModel })
            );
        }

        return requests.map((req) => {
            const pilot = pilotMap.get(req.pilotId) as any;
            const equipment = equipmentMap.get(req.equipmentId);

            return {
                ...req,
                pilotName: pilot ? `${pilot.name} ${pilot.lastname}` : "Unknown Pilot",
                pilotRank: pilot?.rank || "",
                pilotLicense: pilot?.licenseNumber || "",
                aircraftName: equipment?.name || "N/A",
            };
        });
    } catch (error) {
        console.error("Error enriching requests:", error);
        return requests;
    }
};


export const getAllRequestsForAcademy = async (
    academyId: string
): Promise<RequestDocument[]> => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.requestCollectionId,
            [Query.equal("academyId", academyId)]
        );

        const enriched = await enrichRequestsWithDetails(response.documents);
        return enriched as unknown as RequestDocument[];
    } catch (error) {
        console.error("Error fetching academy requests:", error);
        throw error;
    }
};

/**
 * Updates the status of a training request.
 * @param requestId The ID of the request to update
 * @param status The new status (approved, rejected)
 */
export const updateRequestStatus = async (
    requestId: string,
    status: RequestStatus
) => {
    try {
        const result = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.requestCollectionId,
            requestId,
            { status }
        );
        return result;
    } catch (error) {
        console.error(`Error updating request status to ${status}:`, error);
        throw error;
    }
};

/**
 * Fetches training requests for a specific academy, filtered by status.
 * @param academyId The ID of the academy
 * @param status The status to filter by (Pending, Approved, Rejected)
 */
export const getRequestsByStatus = async (
    academyId: string,
    status: RequestStatus
): Promise<RequestDocument[]> => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.requestCollectionId,
            [Query.equal("academyId", academyId), Query.equal("status", status)]
        );

        const enriched = await enrichRequestsWithDetails(response.documents);
        return enriched as unknown as RequestDocument[];
    } catch (error) {
        console.error(
            `Error fetching academy requests with status ${status}:`,
            error
        );
        throw error;
    }
};
