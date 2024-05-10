using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.Entities;
using server.Services.Interfaces;
namespace server.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SpeedTyperDbContext _context;
    private IAuthService _passwordService;
    public UserRepository(SpeedTyperDbContext speedTyperDbContext, IAuthService passwordService)
    {
        _context = speedTyperDbContext;
        _passwordService = passwordService;
    }

    public async Task<IEnumerable<User>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return null;
        }
        return user;
    }

    public async Task<User?> DeleteUser(int id)
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

    public async Task<User?> UpdateUser(User updatedUser)
    {
        var user = await _context.Users.FindAsync(updatedUser.Id);

        if (user == null)
        {
            return null;
        }
        user.FirstName = updatedUser.FirstName ?? user.FirstName;
        user.LastName = updatedUser.LastName ?? user.LastName;
        user.Username = updatedUser.Username ?? user.Username;
        user.Email = updatedUser.Email ?? user.Email;
        user.ProfileImageURL = updatedUser.ProfileImageURL ?? user.ProfileImageURL;

        await _context.SaveChangesAsync();
        return user;
    }
    public async Task<User> RegisterUser(UserRegistrationRequest userRegistrationRequest)
    {
        var newUser = new User
        {
            FirstName = userRegistrationRequest.FirstName,
            LastName = userRegistrationRequest.LastName,
            Email = userRegistrationRequest.Email,
            Password = _passwordService.HashPassword(userRegistrationRequest.Password)
        };
        var user = await _context.Users.AddAsync(newUser);
        await _context.SaveChangesAsync();
        return user.Entity;
    }
    public async Task<bool?> LoginUser(UserLoginRequest userRequest)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userRequest.Email);
        if (user == null)
        {
            return null;
        }
        return _passwordService.VerifyPassword(userRequest.Password, user.Password);
    }
}
