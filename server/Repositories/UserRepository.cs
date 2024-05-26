using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;
using server.Models.Entities;
using server.Services.Interfaces;
using System.Linq.Expressions;
namespace server.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SpeedTyperDbContext _context;
    public UserRepository(SpeedTyperDbContext speedTyperDbContext)
    {
        _context = speedTyperDbContext;
    }

    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return null;
        }
        return user;
    }

    public async Task<User?> GetUserByPredicateAsync(Expression<Func<User, bool>> predicate)
    {
        var user = await _context.Users.FirstOrDefaultAsync(predicate);
        if (user == null)
        {
            return null;
        }
        return user;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        var createdUser = await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return createdUser.Entity;
    }

    public async Task<User?> UpdateUserAsync(int id, UserDTO updatedUser)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return null;
        }

        user.FirstName = updatedUser.FirstName;
        user.LastName = updatedUser.LastName;
        user.Username = updatedUser.Username;
        user.Email = updatedUser.Email;
        user.ProfileImageURL = updatedUser.ProfileImageURL;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return null;
        }
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return user;
    }
}
