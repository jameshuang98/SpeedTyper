using server.Repositories;
using server.Services.Interfaces;

namespace server.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public async Task<bool> IsEmailTakenAsync(string email)
    {
        var user = await _userRepository.GetUserByPredicateAsync(user => user.Email == email);
        if (user == null)
        {
            return false;
        }
        return true;
    }

    public async Task<bool> IsUsernameTakenAsync(string username)
    {
        var user = await _userRepository.GetUserByPredicateAsync(user => user.Username == username);
        if (user == null)
        {
            return false;
        }
        return true;
    }
}
