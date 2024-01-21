export type GameStates = "pregame" | "playing" | "paused" | "postgame";

export interface InputWord {
    idx: number;
    word: string;
    isCorrect: boolean;
}