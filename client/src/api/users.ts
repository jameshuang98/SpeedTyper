import { ApiResponse, User } from "constants/types";
import api from "./axios/axios";

export const getUsers = async (): Promise<ApiResponse> => {
    return api.get(`/user`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const getUser = async (id: number): Promise<ApiResponse> => {
    return api.get(`/user/${id}`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const patchUser = async (user: User): Promise<ApiResponse> => {
    return api.patch(`/user`, user)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};