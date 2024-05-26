using System;
using System.Linq.Expressions;
using server.Models;
using server.Models.DTOs;
using server.Models.Entities;

namespace server.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByPredicateAsync(Expression<Func<User, bool>> predicate);
    Task<User> CreateUserAsync(User user);
    Task<User?> UpdateUserAsync(int id, UserDTO user);
    Task<User?> DeleteUserAsync(int userId);
}
