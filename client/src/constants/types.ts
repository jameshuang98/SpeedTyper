export type GameState = "pregame" | "playing" | "paused" | "postgame";

export interface InputWord {
    idx: number;
    word: string;
    isCorrect: boolean;
}

export interface ScoreDTO {
    id: number;
    userId: number;
    correctWords: number;
    incorrectWords: number;
    characters: number;
    createdDate: string;
}

export interface CreateScoreDTO {
    userId: number;
    correctWords: number;
    incorrectWords: number;
    characters: number;
}

export type SortOption = "recent" | "highest"

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    profileImageURL: string
}

export interface UserLoginRequest {
    identifier: string,
    password: string
}

export interface UserRegistrationRequest {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
}

export interface UserDTO extends UserForm {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    profileImageURL: string
}

// Define a generic type for form data
export interface UserForm {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password?: string; // Make password optional
    profileImageURL?: string; // Make profileImageURL optional
}

export interface ApiResponse {
    statusCode: number,
    data: any
}