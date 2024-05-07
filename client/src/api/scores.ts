import axios from "axios";
import API_BASE_URL from "constants/constants";
import { ApiResponse } from "constants/types";

export const getScores = async (): Promise<ApiResponse> => {
    return axios.get(`${API_BASE_URL}score`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const getUserScores = async (userId: number): Promise<ApiResponse> => {
    return axios.get(`${API_BASE_URL}score/GetUserScores/${userId}`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const getScore = async (id: number): Promise<ApiResponse> => {
    return axios.get(`${API_BASE_URL}score/${id}`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};