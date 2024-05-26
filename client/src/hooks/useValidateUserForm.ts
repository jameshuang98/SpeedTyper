import { useState } from 'react';

import { areObjectsEqual, hasEmptyStringValue, hasNonEmptyStringValue, isNotWhiteSpace, isValidEmail, isValidPassword } from 'helpers';
import { UserForm } from 'constants/types';

// Define a generic type for form errors
interface FormErrors {
    [key: string]: string;
}

// Define a generic type for validation options
interface ValidationOptions {
    [key: string]: boolean | undefined;
}

// Define a generic type for initial form values
type InitialValues<T> = {
    [K in keyof T]: T[K];
}

const useValidateForm = <T extends UserForm>(initialValues: InitialValues<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [validForm, setValidForm] = useState(false);

    const resetForm = (data: InitialValues<T>) => {
        setValues(data);
        setErrors({});
        setValidForm(false);
    }

    const validate = (fieldName: keyof T, value: string, options?: ValidationOptions) => {
        let errorMessage = "";
        switch (fieldName) {
            case "email":
                errorMessage = (value && !isValidEmail(value)) ? "Invalid email" : "";
                break;
            case "password":
                errorMessage = (options?.validatePassword && !isValidPassword(value)) ? "Password must be at least 8 characters long, including at least 1 lowercase character, 1 uppercase character, 1 number, and 1 special character" : "";
                break;
            case "profileImageURL":
                errorMessage = (options?.validateProfileImageURL && !value.trim()) ? "Invalid profile picture" : "";
                break;
            default:
                errorMessage = (!value.trim()) ? "Cannot be empty" : "";
                break;
        }
        setValues(prevValues => ({ ...prevValues, [fieldName]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));

        // Check if any error exists, if all fields are non-empty
        const isValid = !hasNonEmptyStringValue({ ...errors, [fieldName]: errorMessage }) && !areObjectsEqual({ ...values, [fieldName]: value }, initialValues)
        setValidForm(isValid);
    };

    return { values, errors, validForm, validate, resetForm };
}

export default useValidateForm;
