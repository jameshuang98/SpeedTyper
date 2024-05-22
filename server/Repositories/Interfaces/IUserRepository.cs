using System;
using System.Linq.Expressions;
using server.Models;
using server.Models.DTOs;
using server.Models.Entities;

namespace server.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetUsers();
    Task<User?> GetUserById(int id);
    Task<User?> GetUserByPredicate(Expression<Func<User, bool>> predicate);
    Task<User> CreateUser(User user);
    Task<User?> UpdateUser(User user);
    Task<User?> DeleteUser(int userId);
}
