import axios from "axios";
import API_BASE_URL from "constants/constants";
import { ScoreItem } from "constants/types";

export const getScores = async (): Promise<ScoreItem[]> => {
    return axios.get(`${API_BASE_URL}score`)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
        });
};

export const getUserScores = async (userId: number): Promise<ScoreItem[]> => {
    return axios.get(`${API_BASE_URL}score/GetUserScores/${userId}`)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
        });
};

export const getScore = async (id: number): Promise<ScoreItem> => {
    return axios.get(`${API_BASE_URL}score/${id}`)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
        });
};