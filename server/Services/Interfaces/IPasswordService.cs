namespace server.Services.Interfaces;

public interface IPasswordService
{
    string HashPassword(string password);
    bool VerifyPassword(string inputPassword, string hashedPassword);
}
