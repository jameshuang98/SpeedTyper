namespace server.Services.Interfaces;

public interface IAuthService
{
    string HashPassword(string password);
    bool VerifyPassword(string inputPassword, string hashedPassword);
}
