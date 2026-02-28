import api from "../admin-config";
import { User } from "../types";



export const getAllUsers = async () => {
    try {
        const response = await api.get('/users')
        return response.data.users as User[];
    } catch (error) {
        console.log(error);
    }
}

export const changeUserRole = async (userId: string, role: string) => {
    try {
        const response = await api.patch(`/users/change-role`, { userId, role });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}