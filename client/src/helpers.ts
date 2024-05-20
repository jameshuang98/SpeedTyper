/* eslint-disable import/no-anonymous-default-export */

import { ScoreItem, SortOption } from "constants/types";

// Check if a key is a valid character, punctuation, or number
export function isValidKey(key: string): boolean {
    return /^[a-zA-Z0-9,./<>?;':"[\]{}\\|`~!@#$%^&*()_+\-=\s\b]$/.test(key) || key === 'Backspace';
}

export function sortResults(option: SortOption) {
    switch (option) {
        case "recent":
            return ((a: ScoreItem, b: ScoreItem) => {
                // Compare dates first
                const dateA = new Date(a.createdDate);
                const dateB = new Date(b.createdDate);
                const dateComparison = dateB.toDateString().localeCompare(dateA.toDateString());
                if (dateComparison !== 0) {
                    // If dates are different, return the result of the date comparison
                    return dateComparison;
                } else {
                    // If dates are the same, compare times
                    return dateB.getTime() - dateA.getTime();
                }
            });
        case "highest":
        default:
            return ((a: ScoreItem, b: ScoreItem) => b.correctWords - a.correctWords);
    }
}

