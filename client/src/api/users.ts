import axios from "axios";
import API_BASE_URL from "constants/constants";
import { User, UserLoginRequest, UserRegistrationRequest } from "constants/types";

export const getUsers = async (): Promise<User[]> => {
    return axios.get(`${API_BASE_URL}user`)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const getUser = async (id: number): Promise<User> => {
    return axios.get(`${API_BASE_URL}user/${id}`)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const registerUser = async (userRegistrationRequest: UserRegistrationRequest): Promise<User> => {
    return axios.post(`${API_BASE_URL}user/register`, userRegistrationRequest)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

export const loginUser = async (userLoginRequest: UserLoginRequest): Promise<boolean> => {
    return axios.post(`${API_BASE_URL}user/login`, userLoginRequest)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
            if (error.response && error.response.status === 401) {
                console.log("Incorrect Credentials")
            }
            return false;
        });
};