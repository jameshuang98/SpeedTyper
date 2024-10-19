using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using server.Repositories;
using server.Services;
using server.Models.Entities;
using System.Security.Claims;
using server.Models.DTOs;
using System.Linq.Expressions;

namespace server.Tests.Service
{
    public class AuthServiceTests
    {
        private readonly AuthService _authService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        public AuthServiceTests()
        {
            _httpContextAccessor = A.Fake<IHttpContextAccessor>();
            _configuration = A.Fake<IConfiguration>();
            _userRepository = A.Fake<IUserRepository>();

            _authService = new AuthService(_httpContextAccessor, _configuration, _userRepository);
        }

        [Fact]
        public void AuthService_HashPassword_ReturnsHashedPassword()
        {
            // Arrange
            var password = "password123";

            // Act
            var result = _authService.HashPassword(password);

            // Assert
            result.Should().NotBeNull();
            result.Should().NotBe(password);
        }

        [Fact]
        public void AuthService_VerifyPassword_ReturnsTrueWhenPasswordMatches()
        {
            // Arrange
            string password = "password123";
            var hashedPassword = _authService.HashPassword(password);

            // Act
            bool result = _authService.VerifyPassword(password, hashedPassword);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void AuthService_VerifyPassword_ReturnsFalseWhenPasswordDoesNotMatch()
        {
            // Arrange
            string password = "password123";
            string incorrectPassword = "wrongPassword";
            var hashedPassword = _authService.HashPassword(password);

            // Act
            bool result = _authService.VerifyPassword(incorrectPassword, hashedPassword);

            // Assert
            result.Should().BeFalse();
        }

        //[Fact]
        //public void AuthService_GenerateToken_ReturnsToken()
        //{
        //    // Arrange
        //    var user = new User
        //    {
        //        FirstName = "John",
        //        LastName = "Doe",
        //        Username = "JohnDoe",
        //        Email = "johndoe@gmail.com",
        //    };

        //    A.CallTo(() => _configuration.GetValue<string>("JWT_KEY")).Returns("secret_key");

        //    // Act
        //    var result = _authService.GenerateToken(user);

        //    // Assert
        //    result.Should().NotBeNull();
        //    result.Should().BeOfType<string>();
        //}

        [Fact]
        public void AuthService_IsAuthenticated_ReturnsTrueWhenUserIsAuthenticated()
        {
            // Arrange
            var fakeIdentity = A.Fake<ClaimsIdentity>();
            A.CallTo(() => fakeIdentity.IsAuthenticated).Returns(true);

            var fakePrincipal = A.Fake<ClaimsPrincipal>();
            A.CallTo(() => fakePrincipal.Identity).Returns(fakeIdentity);

            var fakeContext = A.Fake<HttpContext>();
            A.CallTo(() => fakeContext.User).Returns(fakePrincipal);

            A.CallTo(() => _httpContextAccessor.HttpContext).Returns(fakeContext);

            // Act
            var result = _authService.IsAuthenticated();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void AuthService_IsAuthenticated_ReturnsFalseWhenUserIsNotAuthenticated()
        {
            // Arrange
            var fakeIdentity = A.Fake<ClaimsIdentity>();
            A.CallTo(() => fakeIdentity.IsAuthenticated).Returns(false);

            var fakePrincipal = A.Fake<ClaimsPrincipal>();
            A.CallTo(() => fakePrincipal.Identity).Returns(fakeIdentity);

            var fakeContext = A.Fake<HttpContext>();
            A.CallTo(() => fakeContext.User).Returns(fakePrincipal);

            A.CallTo(() => _httpContextAccessor.HttpContext).Returns(fakeContext);

            // Act
            var result = _authService.IsAuthenticated();

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void AuthService_GetUserIdFromClaims_ReturnsUserIdWhenClaimExists()
        {
            // Arrange
            var claims = new List<Claim> { new Claim("id", "1") };
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);

            var httpContext = A.Fake<HttpContext>();
            A.CallTo(() => httpContext.User).Returns(principal);
            A.CallTo(() => _httpContextAccessor.HttpContext).Returns(httpContext);

            // Act
            var result = _authService.GetUserIdFromClaims();

            // Assert
            result.Should().Be(1);
        }

        [Fact]
        public void AuthService_GetUserIdFromClaims_ReturnsNullWhenClaimDoesNotExist()
        {
            // Arrange
            var claims = new List<Claim>(); // No "id" claim
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);

            var httpContext = A.Fake<HttpContext>();
            A.CallTo(() => httpContext.User).Returns(principal);
            A.CallTo(() => _httpContextAccessor.HttpContext).Returns(httpContext);

            // Act
            var result = _authService.GetUserIdFromClaims();

            // Assert
            result.Should().BeNull();

        }

        [Fact]
        public async Task AuthService_RegisterUserAsync_ReturnsNewUser()
        {
            // Arrange
            var userRegistrationRequest = new UserRegistrationRequestDTO
            {
                FirstName = "John",
                LastName = "Doe",
                Username = "johndoe",
                Email = "john@gmail.com",
                Password = "password123"
            };

            var newUser = new User
            {
                FirstName = userRegistrationRequest.FirstName,
                LastName = userRegistrationRequest.LastName,
                Username = userRegistrationRequest.Username,
                Email = userRegistrationRequest.Email,
                Password = _authService.HashPassword(userRegistrationRequest.Password)
            };

            A.CallTo(() => _userRepository.CreateUserAsync(A<User>.Ignored)).Returns(Task.FromResult(newUser));

            // Act
            var result = await _authService.RegisterUserAsync(userRegistrationRequest);

            // Assert
            result.Should().BeEquivalentTo(newUser);
        }

        [Fact]
        public async Task AuthService_LoginUserAsync_ReturnsUserIfCredentialsAreValid()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Username = "johndoe",
                Email = "john@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123")
            };

            // Specify the predicate to return the correct user
            A.CallTo(() => _userRepository.GetUserByPredicateAsync(A<Expression<Func<User, bool>>>.Ignored))
                .Returns(Task.FromResult<User?>(user)); // Handle nullable user

            // Act
            var result = await _authService.LoginUserAsync("johndoe", "password123");

            // Assert
            result.Should().BeEquivalentTo(user);
        }

        [Fact]
        public async Task AuthService_LoginUserAsync_ReturnsNullIfCredentialsAreInvalid()
        {
            // Arrange
            A.CallTo(() => _userRepository.GetUserByPredicateAsync(A<Expression<Func<User, bool>>>.Ignored))
                .Returns(Task.FromResult<User?>(null));

            // Act
            var result = await _authService.LoginUserAsync("invalidUser", "wrongPassword");

            // Assert
            result.Should().BeNull();
        }

    }
}
