using server.Services.Interfaces;

namespace server.Services;

public class AuthService : IAuthService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string inputPassword, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(inputPassword, hashedPassword);
    }
}
