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
    public bool IsEmailTaken(string email)
    {
        var user = _userRepository.GetUserByPredicate(user => user.Email == email);
        if (user == null)
        {
            return false;
        }
        return true;
    }

    public bool IsUsernameTaken(string username)
    {
        var user = _userRepository.GetUserByPredicate(user => user.Username == username);
        if (user == null)
        {
            return false;
        }
        return true;
    }
}
