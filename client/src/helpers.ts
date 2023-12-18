/* eslint-disable import/no-anonymous-default-export */

// Check if a key is a valid character, punctuation, or number
const isValidKey = (key: string): boolean => {
    return /^[a-zA-Z0-9,./<>?;':"[\]{}\\|`~!@#$%^&*()_+\-=\s\b]$/.test(key) || key === 'Backspace';
}


export default isValidKey
