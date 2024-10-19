namespace server.Services.Interfaces;

public interface IUserService
{
    Task<bool> IsEmailTakenAsync(string email);
    Task<bool> IsUsernameTakenAsync(string username);
}
