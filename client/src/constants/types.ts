export type GameState = "pregame" | "playing" | "paused" | "postgame";

export interface InputWord {
    idx: number;
    word: string;
    isCorrect: boolean;
}

export interface ScoreItem {
    id: number;
    correctWords: number;
    incorrectWords: number;
    characters: number;
    createdDate: string;
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
    email: string,
    password: string
}

export interface UserRegistrationRequest {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}