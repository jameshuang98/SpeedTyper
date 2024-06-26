import api from "./axios/axios";
import { ApiResponse, UserLoginRequest, UserRegistrationRequest } from "constants/types";

export const registerUser = async (userRegistrationRequest: UserRegistrationRequest): Promise<ApiResponse> => {
    return api.post(`auth/register`, userRegistrationRequest)
        .then(response => {
            if (response.status === 201) {
                localStorage.setItem('jwtToken', response.data);
            }
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            throw error;
        });
};

export const loginUser = async (userLoginRequest: UserLoginRequest): Promise<ApiResponse> => {
    return api.post(`auth/login`, userLoginRequest)
        .then(response => {
            if (response.status === 200) {
                localStorage.setItem('jwtToken', response.data);
            }
            return { statusCode: response.status, data: response.data };
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                console.log("Incorrect Credentials")
            }
            throw error;
        });
};