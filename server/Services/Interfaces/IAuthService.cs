using server.Models.Entities;

namespace server.Services.Interfaces;

public interface IAuthService
{
    string HashPassword(string password);
    bool VerifyPassword(string inputPassword, string hashedPassword);
    string GenerateToken(User user);
    bool IsAuthenticated();
    int? GetUserIdFromClaims();
    bool IsUserAuthorized(int userId);
}
