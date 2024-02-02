using Microsoft.EntityFrameworkCore;
using server.Entities;
namespace server.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SpeedTyperDbContext _context;
    public UserRepository(SpeedTyperDbContext speedTyperDbContext)
    {
        _context = speedTyperDbContext;

    }
    public async Task<IEnumerable<User>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }
    public async Task<User> GetUserById(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> CreateUser(User user)
    {
        var result = await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task<User> DeleteUser(int id)
    {
        var result = await _context.Users.FindAsync(id);
        if (result != null)
        {
            _context.Users.Remove(result);
            await _context.SaveChangesAsync();
        }
        return result;
    }

    public async Task<User> UpdateUser(User user)
    {
        var result = await _context.Users.FindAsync(user.Id);

        if (result != null)
        {
            result = user;
            await _context.SaveChangesAsync();
        }

        return result;
    }
}
