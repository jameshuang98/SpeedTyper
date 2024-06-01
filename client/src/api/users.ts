import { ApiResponse } from "constants/types";
import api from "./axios/axios";
import { Operation } from "fast-json-patch";

export const getUsers = async (): Promise<ApiResponse> => {
    return api.get(`/user`)
        .then(response => {
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            throw error;
        });
};

export const getUser = async (id: number): Promise<ApiResponse> => {
    return api.get(`/user/${id}`)
        .then(response => {
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            throw error;
        });
};

export const patchUser = async (id: number, patchDocument: Operation[]): Promise<ApiResponse> => {
    return api.patch(`/user/${id}`,
        patchDocument,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            throw error;
        });
};