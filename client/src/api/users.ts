import { ApiResponse, User } from "constants/types";
import api from "./axios/axios";
import { Operation } from "fast-json-patch";

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

export const patchUser = async (id: number, patchDocument: Operation[]): Promise<ApiResponse> => {
    console.log("json", JSON.stringify(patchDocument))
    return api.patch(`/user/${id}`,
        patchDocument,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};