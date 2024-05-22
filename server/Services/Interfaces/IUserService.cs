namespace server.Services.Interfaces;

public interface IUserService
{
    bool IsEmailTaken(string email);
    bool IsUsernameTaken(string username);
}
