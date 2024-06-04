import { useState } from 'react';

import { areObjectsEqual, hasEmptyStringValue, hasNonEmptyStringValue, isNotWhiteSpace, isValidEmail, isValidPassword } from 'helpers';
import { UserForm } from 'constants/types';

// Define a generic type for form errors
interface FormErrors {
    [key: string]: string;
}

// Define a generic type for validation options
type ValidationOptions<T> = {
    [K in keyof T]?: boolean;
};

// Define a generic type for initial form values
type InitialValues<T> = {
    [K in keyof T]: T[K];
}

const useValidateForm = <T extends UserForm>(initialValues: InitialValues<T>, validationOptions: ValidationOptions<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [validForm, setValidForm] = useState(false);

    const resetForm = (data: InitialValues<T>) => {
        setValues(data);
        setErrors({});
        setValidForm(false);
    }

    const validate = (fieldName: keyof T, value: string) => {
        let errorMessage = "";
        switch (fieldName) {
            case "email":
                errorMessage = !value ? "Cannot be empty" : !isValidEmail(value) ? "Invalid email" : "";
                break;
            case "password":
                errorMessage = !isValidPassword(value) ? "Password must be at least 8 characters long, including at least 1 lowercase character, 1 uppercase character, 1 number, and 1 special character" : "";
                break;
            case "profileImageURL":
                errorMessage = (validationOptions.profileImageURL && !value.trim()) ? "Invalid profile picture" : "";
                break;
            default:
                errorMessage = (!value.trim()) ? "Cannot be empty" : "";
                break;
        }
        setValues(prevValues => ({ ...prevValues, [fieldName]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));

        // Check if any error exists, if all fields are non-empty
        const formValues = { ...values, [fieldName]: value };
        const requiredFormValues = Object.fromEntries(
            Object.entries(formValues).filter(([key, value]) => validationOptions[key as keyof T])
        );
        const isValid = !hasNonEmptyStringValue({ ...errors, [fieldName]: errorMessage }) && !hasEmptyStringValue(requiredFormValues) && !areObjectsEqual({ ...values, [fieldName]: value }, initialValues)
        setValidForm(isValid);
    };

    return { values, errors, validForm, validate, resetForm };
}

export default useValidateForm;
