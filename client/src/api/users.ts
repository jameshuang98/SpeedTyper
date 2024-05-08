import axios from "axios";
import API_BASE_URL from "constants/constants";
import { ApiResponse, UserLoginRequest, UserRegistrationRequest } from "constants/types";

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

export const registerUser = async (userRegistrationRequest: UserRegistrationRequest): Promise<ApiResponse> => {
    return axios.post(`${API_BASE_URL}user/register`, userRegistrationRequest)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log(error)
            return { statusCode: error.status, data: error.data };
        });
};

export const loginUser = async (userLoginRequest: UserLoginRequest): Promise<ApiResponse> => {
    return axios.post(`${API_BASE_URL}user/login`, userLoginRequest)
        .then(response => {
            console.log("response", response);
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            console.log('error', error)
            if (error.response && error.response.status === 401) {
                console.log("Incorrect Credentials")
            }
            return { statusCode: error.status, data: error.data };
        });
};