using System;
using server.Models;
using server.Models.Entities;

namespace server.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetUsers();
    Task<User?> GetUserById(int id);
    Task<User> RegisterUser(UserRegistrationRequest user);
    Task<User?> LoginUser(UserLoginRequest user);
    Task<User?> UpdateUser(User user);
    Task<User?> DeleteUser(int userId);
}
