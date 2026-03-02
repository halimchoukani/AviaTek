import { Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "../appwrite";
import { ScheduleDocument } from "../types";

/**
 * Fetches all schedules for a specific pilot, ordered by start time descending.
 */
export const getSchedulesByPilot = async (
    pilotId: string
): Promise<ScheduleDocument[]> => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.scheduleCollectionId,
            [
                Query.equal("pilotId", pilotId),
                Query.orderDesc("startTime"),
            ]
        );

        const enriched = await enrichSchedulesWithDetails(response.documents);
        return enriched as unknown as ScheduleDocument[];
    } catch (error) {
        console.error("Error fetching pilot schedules:", error);
        throw error;
    }
};

/**
 * Enriches schedule documents with equipment names.
 */
const enrichSchedulesWithDetails = async (schedules: any[]): Promise<any[]> => {
    if (schedules.length === 0) return [];

    try {
        const equipmentIds = [
            ...new Set(schedules.map((s) => s.equipmentId).filter((id) => !!id)),
        ];

        const equipmentMap = new Map<string, { name: string; registration?: string }>();

        if (equipmentIds.length > 0) {
            const [planesResponse, simulatorsResponse] = await Promise.all([
                databases
                    .listDocuments(appwriteConfig.databaseId, "equipment", [
                        Query.equal("$id", equipmentIds),
                    ])
                    .catch(() => ({ documents: [] })),
                databases
                    .listDocuments(appwriteConfig.databaseId, "simulators", [
                        Query.equal("$id", equipmentIds),
                    ])
                    .catch(() => ({ documents: [] })),
            ]);

            planesResponse.documents.forEach((p: any) =>
                equipmentMap.set(p.$id, {
                    name: p.name || p.modelNumber || "Unknown Aircraft",
                    registration: p.registration || p.$id,
                })
            );
            simulatorsResponse.documents.forEach((s: any) =>
                equipmentMap.set(s.$id, {
                    name: s.simulatorModel || "Unknown Simulator",
                    registration: s.$id,
                })
            );
        }

        return schedules.map((schedule) => {
            const equipment = equipmentMap.get(schedule.equipmentId);
            return {
                ...schedule,
                equipmentName: equipment?.name || "N/A",
                equipmentRegistration: equipment?.registration || schedule.equipmentId,
            };
        });
    } catch (error) {
        console.error("Error enriching schedules:", error);
        return schedules;
    }
};
