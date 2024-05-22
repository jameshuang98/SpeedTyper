using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace server.Validators;

public class ComplexPasswordAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        var password = value as string;
        if (string.IsNullOrEmpty(password))
        {
            return new ValidationResult("Password is required.");
        }

        var hasUpperCase = Regex.IsMatch(password, @"[A-Z]");
        var hasLowerCase = Regex.IsMatch(password, @"[a-z]");
        var hasDigits = Regex.IsMatch(password, @"[0-9]");
        var hasSpecialChars = Regex.IsMatch(password, @"[\W_]");

        if (!hasUpperCase || !hasLowerCase || !hasDigits || !hasSpecialChars)
        {
            return new ValidationResult("Password must be complex enough.");
        }

        return ValidationResult.Success;
    }
}