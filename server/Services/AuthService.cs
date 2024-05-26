using Microsoft.IdentityModel.Tokens;
using server.Models.DTOs;
using server.Models.Entities;
using server.Repositories;
using server.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRepository _userRepository;

    public AuthService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, IUserRepository userRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
        _userRepository = userRepository;
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

    public async Task<User> RegisterUserAsync(UserRegistrationRequestDTO userRegistrationRequest)
    {
        var newUser = new User
        {
            FirstName = userRegistrationRequest.FirstName,
            LastName = userRegistrationRequest.LastName,
            Username = userRegistrationRequest.Username,
            Email = userRegistrationRequest.Email,
            Password = HashPassword(userRegistrationRequest.Password)
        };

        return await _userRepository.CreateUserAsync(newUser);
    }

    public async Task<User?> LoginUserAsync(string identifier, string password)
    {
        User? user;

        // Check if the identifier is a valid email
        if (IsValidEmail(identifier))
        {
            user = await _userRepository.GetUserByPredicateAsync(u => u.Email == identifier);
        }
        else
        {
            user = await _userRepository.GetUserByPredicateAsync(u => u.Username == identifier);
        }

        if (user == null || !VerifyPassword(password, user.Password))
        {
            return null;
        }

        return user;
    }

    private bool IsValidEmail(string email)
    {
        return new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email);
    }
}
