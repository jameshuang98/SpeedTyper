using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.DataCollection;
using server.Models.DTOs;
using server.Models.Entities;
using server.Repositories;

namespace server.Tests.Repository
{
    public class UserRepositoryTests
    {
        public async Task<SpeedTyperDbContext> GetDbContext()
        {
            var options = new DbContextOptionsBuilder<SpeedTyperDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var dbContext = new SpeedTyperDbContext(options);
            dbContext.Database.EnsureCreated();

            if (await dbContext.Users.CountAsync() > 0)
            {
                dbContext.Users.RemoveRange(dbContext.Users);
            };

            List<User> users = new List<User>()
                {
                    new User
                    {
                        FirstName = "John",
                        LastName = "Doe",
                        Username = "JohnDoe",
                        Email = "johndoe@gmail.com",
                        Password = BCrypt.Net.BCrypt.HashPassword("password1")
                    },
                    new User
                    {
                        FirstName = "Kevin",
                        LastName = "Donk",
                        Username = "easymoneysniper",
                        Email = "kevindonk@gmail.com",
                        Password = BCrypt.Net.BCrypt.HashPassword("password2")
                    },
                    new User
                    {
                        FirstName = "Jake",
                        LastName = "Blake",
                        Username = "JBSandwich",
                        Email = "jakeblake@gmail.com",
                        Password = BCrypt.Net.BCrypt.HashPassword("password3")
                    }
            };
            dbContext.Users.AddRange(users);

            await dbContext.SaveChangesAsync();
            return dbContext;
        }

        [Fact]
        public async Task UserRepository_GetUsersAsync_ReturnsUsers()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.GetUsersAsync();

            // Assert
            result.Should().NotBeNull();
            result.Count().Should().Be(3);
        }

        [Fact]
        public async Task UserRepository_GetUserByIdAsync_ReturnsUserWhenUserExists()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.GetUserByIdAsync(2); // Id #1 taken by seed data - see OnModelCreating in SpeedTyperDbContext.cs

            // Assert
            result.Should().NotBeNull();
        }

        [Fact]
        public async Task UserRepository_GetUserByIdAsync_ReturnsNullWhenUserDoesNotExist()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.GetUserByIdAsync(99);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task UserRepository_GetUserByPredicateAsync_ReturnsUserWhenPredicateMatches()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.GetUserByPredicateAsync(u => u.Email == "johndoe@gmail.com");

            // Assert
            result.Should().NotBeNull();
            result!.FirstName.Should().Be("John");
        }

        [Fact]
        public async Task UserRepository_GetUserByPredicateAsync_ReturnsNullWhenPredicateDoesNotMatch()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.GetUserByPredicateAsync(u => u.Email == "nonexistent@example.com");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task UserRepository_CreateUserAsync_ReturnsCreatedUser()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);
            var newUser = new User
            {
                FirstName = "Andrew",
                LastName = "Griffin",
                Username = "AG",
                Email = "andrewgriffin@gmail.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password4")
            };

            // Act
            var result = await userRepository.CreateUserAsync(newUser);
            var users = await userRepository.GetUsersAsync();

            // Assert
            result.Should().NotBeNull();
            result.FirstName.Should().Be("Andrew");
            users.Count().Should().Be(4);
        }

        [Fact]
        public async Task UserRepository_UpdateUserAsync_ReturnsUpdatedUserWhenUserExists()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);
            var updatedUser = new UserDTO
            {
                FirstName = "John",
                LastName = "Donk",
                Username = "john_donk",
                Email = "johndonk@gmail.com",
            };

            // Act
            var userToUpdate = await userRepository.GetUserByPredicateAsync(u => u.Email == "johndoe@gmail.com");
            Assert.NotNull(userToUpdate);
            var result = await userRepository.UpdateUserAsync(userToUpdate.Id, updatedUser);

            // Assert
            result.Should().NotBeNull();
            result!.LastName.Should().Be("Donk");
            result.Email.Should().Be("johndonk@gmail.com");
        }

        [Fact]
        public async Task UserRepository_UpdateUserAsync_ReturnsNullWhenUserDoesNotExist()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);
            var updatedUser = new UserDTO
            {
                FirstName = "Fake",
                LastName = "User",
                Username = "fake_user",
                Email = "fakeuser@gmail.com"
            };

            // Act
            var result = await userRepository.UpdateUserAsync(99, updatedUser);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task UserRepository_DeleteUserAsync_ReturnsDeletedUserWhenUserExists()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.DeleteUserAsync(2);
            var users = await userRepository.GetUsersAsync();

            // Assert
            result.Should().NotBeNull();
            users.Count().Should().Be(2);
        }

        [Fact]
        public async Task UserRepository_DeleteUserAsync_ReturnsNullWhenUserDoesNotExist()
        {
            // Arrange
            var dbContext = await GetDbContext();
            var userRepository = new UserRepository(dbContext);

            // Act
            var result = await userRepository.DeleteUserAsync(99);

            // Assert
            result.Should().BeNull();
        }
    }
}
