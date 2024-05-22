import { useState } from 'react';

import { UserRegistrationRequest } from 'constants/types';
import { areObjectsEqual, hasEmptyStringValue, hasNonEmptyStringValue, isNotWhiteSpace, isValidEmail, isValidPassword } from 'helpers';

interface FormErrors {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

interface ValidationOptions {
    validatePassword?: boolean; // Optional parameter to indicate whether to validate the password field
}

const useValidateUserForm = (initialValues: UserRegistrationRequest) => {
    const [values, setValues] = useState<UserRegistrationRequest>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });
    const [validForm, setValidForm] = useState(false);

    const validate = (fieldName: keyof UserRegistrationRequest, value: string, options?: ValidationOptions) => {
        let errorMessage = "";
        switch (fieldName) {
            case "email":
                errorMessage = !isValidEmail(value) ? "Invalid email" : "";
                break;
            case "password":
                errorMessage = options?.validatePassword && !isValidPassword(value) ? "Password must be at least 8 characters long, including at least 1 lowercase character, 1 uppercase character, 1 number, and 1 special character" : "";
                break;
            default:
                errorMessage = !isNotWhiteSpace(value) ? "Cannot be empty" : "";
                break;
        }
        setValues((prevValues: UserRegistrationRequest) => ({ ...prevValues, [fieldName]: value }));
        setErrors((prevErrors: FormErrors) => ({ ...prevErrors, [fieldName]: errorMessage }));

        // Check if any error exists and if all fields are non-empty
        const isValid = !hasNonEmptyStringValue({ ...errors, [fieldName]: errorMessage }) && !hasEmptyStringValue({ ...values, [fieldName]: value }) && !areObjectsEqual({ ...values, [fieldName]: value }, initialValues)
        setValidForm(isValid);
    };

    return { values, errors, validForm, validate };
}

export default useValidateUserForm;