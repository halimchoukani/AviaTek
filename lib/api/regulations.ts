import api from "../api-config";
import { RegulationDocument } from "../types";

export const getAllRegulations = async () => {
    try {

        const response = await api.get('/regulations');
        console.log("response : ", response.data.regulations.documents);
        return response.data.regulations.documents as RegulationDocument[];
    } catch (error) {
        console.log(error); return [];
    }
}

export const getRegulationById = async (id: string) => {
    try {
        const response = await api.get(`/regulations/${id}`);
        return response.data.regulation as RegulationDocument;
    } catch (error) {
        console.log(error); return null;
    }
}