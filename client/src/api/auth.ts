import axios from "axios";
import API_BASE_URL from "constants/constants";
import { ApiResponse, UserLoginRequest, UserRegistrationRequest } from "constants/types";

export const registerUser = async (userRegistrationRequest: UserRegistrationRequest): Promise<ApiResponse> => {
    return axios.post(`${API_BASE_URL}auth/register`, userRegistrationRequest)
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
    return axios.post(`${API_BASE_URL}auth/login`, userLoginRequest)
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