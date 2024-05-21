/* eslint-disable import/no-anonymous-default-export */

import { ScoreItem, SortOption } from "constants/types";

// Check if a key is a valid character, punctuation, or number
export function isValidKey(key: string): boolean {
    return /^[a-zA-Z0-9,./<>?;':"[\]{}\\|`~!@#$%^&*()_+\-=\s\b]$/.test(key) || key === 'Backspace';
}

export function isValidEmail(email: string): boolean {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

export function isValidPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(?!.*\s).{8,}$/.test(password);
}

export function isNotWhiteSpace(value: string): boolean {
    return value.trim() !== "";
}

export function hasNonEmptyStringValue(obj: { [key: string]: string }): boolean {
    for (const value of Object.values(obj)) {
        if (typeof value === 'string' && value.trim() !== '') {
            return true;
        }
    }
    return false;
}

export function hasEmptyStringValue(obj: { [key: string]: string }): boolean {
    for (const value of Object.values(obj)) {
        if (typeof value === 'string' && value.trim() === '') {
            return true;
        }
    }
    return false;
}

export function areObjectsEqual(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
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

