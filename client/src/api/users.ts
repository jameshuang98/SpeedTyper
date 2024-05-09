import axios from "axios";
import API_BASE_URL from "constants/constants";
import { ApiResponse } from "constants/types";

export const getUsers = async (): Promise<ApiResponse> => {
    return axios.get(`${API_BASE_URL}user`)
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
    return axios.get(`${API_BASE_URL}user/${id}`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            return { statusCode: error.status, data: error.data };
        });
};