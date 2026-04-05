import adminApi from "../admin-config";
import { User } from "../types";

export const getAllUsers = async () => {
    try {
        const response = await adminApi.get('/users');
        return response.data.users as User[];
    } catch (error) {
        console.log(error);
    }
}

export const changeUserRole = async (userId: string, role: string) => {
    try {
        const response = await adminApi.patch(`/users/change-role`, { userId, role });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}