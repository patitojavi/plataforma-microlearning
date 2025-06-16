import axios from "axios";
import { type UserData } from "./auth";


const API_URL = "http://localhost:5000/api/usuarios";

export const getUsuarios = async (token: string): Promise<UserData[]> => {
    try {
        const response = await axios.get<UserData[]>(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        throw error;
    }
};

export const updateUsuario = async (usuarioId: string, usuarioData: UserData) => {
    try {
        const token = localStorage.getItem("token");
        usuarioId = token.id;
        const response = await axios.put(`${API_URL}/${usuarioId}`, usuarioData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating usuario:", error);
        throw error;
    }
};

export const deleteUsuario = async (usuarioId: string) => {
    try {
        const token = localStorage.getItem("token");
        usuarioId = token.id;
        const response = await axios.delete(`${API_URL}/${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting usuario:", error);
        throw error;
    }
};
