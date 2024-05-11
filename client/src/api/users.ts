import { ApiResponse } from "constants/types";
import api from "./axios/axios";

export const getUsers = async (): Promise<ApiResponse> => {
    return api.get(`/user`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            return { statusCode: error.status, data: error.data };
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
            return { statusCode: error.status, data: error.data };
        });
};