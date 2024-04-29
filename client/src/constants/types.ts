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