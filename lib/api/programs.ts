import api from "../api-config";
import { createJWT } from "../appwrite";
import { ProgramLicense, ProgramLicenseDocument } from "../types";

export const getProgramsByRegulationId = async (id: string) => {
    try {
        // Assume backend fetches programs via regulation ID
        const response = await api.get(`/regulation-programs/${id}`);

        // Adjust response extraction as per backend format, guessing standard structure
        if (response.data.regulationPrograms) {
            return response.data.regulationPrograms.documents as ProgramLicenseDocument[];
        }
        return response.data.documents as ProgramLicenseDocument[];
    } catch (error) {
        console.log("Error fetching programs:", error);
        return [];
    }
}

export const createProgram = async (data: Partial<ProgramLicense>) => {
    try {
        console.log("Creating program:", data);
        const token = await createJWT();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.post('/regulation-programs', data, { headers });
        return response.data.program as ProgramLicenseDocument;
    } catch (error) {
        console.log("Error creating program:", error);
        throw error;
    }
}

export const updateProgram = async (id: string, data: Partial<ProgramLicense>) => {
    try {
        const token = await createJWT();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.patch(`/regulation-programs/${id}`, data, { headers });
        return response.data.program as ProgramLicenseDocument;
    } catch (error) {
        console.log("Error updating program:", error);
        throw error;
    }
}