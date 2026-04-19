import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_LMS_API || process.env.EXPO_PUBLIC_API || "https://aviatekserver.onrender.com";
console.log("API_BASE:", API_BASE);

const api = axios.create({
    baseURL: `${API_BASE}/api/`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Debug interceptor
api.interceptors.request.use(config => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error(`❌ API Error [${error.response?.status}]:`, error.config?.url);
        return Promise.reject(error);
    }
);

export const getAcademyStats = async (academyId: string) => {
    try {
        const response = await api.get(`users/stats/${academyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return null;
    }
};

export const getAcademyCourses = async (academyId: string) => {
    try {
        const response = await api.get(`courses/get/${academyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};
