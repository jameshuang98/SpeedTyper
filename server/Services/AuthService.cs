using Microsoft.IdentityModel.Tokens;
using server.Models.Entities;
using server.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
    }
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string inputPassword, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(inputPassword, hashedPassword);
    }

    public string GenerateToken(User user)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim("username", user.Username),
            new Claim("email", user.Email),
            new Claim("firstName", user.FirstName),
            new Claim("lastName", user.LastName),
            new Claim("profileImageURL", user.ProfileImageURL),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt:Key").Value!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials
            );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

    public bool IsAuthenticated()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User?.Identity == null)
        {
            return false;
        }
        return httpContext.User.Identity.IsAuthenticated;
    }

    public int? GetUserIdFromClaims()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User == null)
        {
            return null;
        }

        var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "id");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return null;
        }

        return userId;
    }

    public bool IsUserAuthorized(int userId)
    {
        var currentUserId = GetUserIdFromClaims();
        return currentUserId.HasValue && currentUserId.Value == userId;
    }
}
