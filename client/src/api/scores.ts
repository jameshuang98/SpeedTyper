import { ApiResponse, CreateScoreDTO } from "constants/types";
import api from "./axios/axios";

export const getScores = async (): Promise<ApiResponse> => {
    return api.get(`/score`)
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
    return api.get(`/score/GetUserScores/${userId}`)
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
    return api.get(`/score/${id}`)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const postScore = async (score: CreateScoreDTO): Promise<ApiResponse> => {
    return api.post(`/score/`, score)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};