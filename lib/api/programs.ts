import api from "../api-config";
import { createJWT } from "../appwrite";
import { ProgramLicense, ProgramLicenseDocument } from "../types";

export const getProgramsByRegulationId = async (id: string) => {
    try {
        console.log("Fetching programs for Regulation ID:", id);
        // Assume backend fetches programs via regulation ID
        const response = await api.get(`/regulation-programs/${id}`);
        console.log("Programs API Response:", response.data);

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

export const getProgramsByAcademyId = async (academyId: string) => {
    try {
        console.log("Fetching programs for Academy ID:", academyId);
        const response = await api.get(`/academy-programs/${academyId}`);
        console.log("Academy Programs API Response:", response.data);
        if (response.data.academyPrograms) {
            return response.data.academyPrograms.documents as ProgramLicenseDocument[];
        }
        return response.data.documents as ProgramLicenseDocument[];
    } catch (error) {
        console.log("Error fetching programs by academy ID:", error);
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