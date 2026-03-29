import api from "../api-config";
import { createJWT } from "../appwrite";
import { RegulationDocument } from "../types";

export const getAllRegulations = async () => {
    try {
        const response = await api.get('/regulations');

        return response.data.regulations.documents as RegulationDocument[];
    } catch (error) {
        console.log("Error fetching regulations: get", error); return [];
    }
}

export const getRegulationById = async (id: string) => {
    try {
        const response = await api.get(`/regulations/${id}`);
        return response.data.regulation as RegulationDocument;
    } catch (error) {
        console.log("Error getting regulation by ID:", error);
        return null;
    }
}

export const createRegulation = async (data: any) => {
    try {
        const token = await createJWT();

        let body: any = data;
        let headers: any = { Authorization: `Bearer ${token}` };

        if (data.logoFile) {
            body = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'logoFile') {
                    body.append('logoFile', {
                        uri: data.logoFile.uri,
                        type: data.logoFile.mimeType || 'image/jpeg',
                        name: data.logoFile.fileName || `logo_${Date.now()}.jpg`,
                    } as any);
                } else if (data[key] !== undefined && data[key] !== null) {
                    body.append(key, typeof data[key] === 'boolean' ? String(data[key]) : data[key]);
                }
            });
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await api.post('/regulations', body, { headers });
        return response.data.regulation as RegulationDocument;
    } catch (error) {
        console.log("Error creating regulation:", error);
        throw error;
    }
}

export const updateRegulation = async (id: string, data: any) => {
    try {
        const token = await createJWT();

        let body: any = data;
        let headers: any = { Authorization: `Bearer ${token}` };

        if (data.logoFile) {
            body = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'logoFile') {
                    body.append('logoFile', {
                        uri: data.logoFile.uri,
                        type: data.logoFile.mimeType || 'image/jpeg',
                        name: data.logoFile.fileName || `logo_${Date.now()}.jpg`,
                    } as any);
                } else if (data[key] !== undefined && data[key] !== null) {
                    body.append(key, typeof data[key] === 'boolean' ? String(data[key]) : data[key]);
                }
            });
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await api.patch(`/regulations/${id}`, body, { headers });
        return response.data.regulation as RegulationDocument;
    } catch (error) {
        console.log("Error updating regulation:", error);
        throw error;
    }
}