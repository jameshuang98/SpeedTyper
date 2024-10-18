using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Controllers;
using server.Extensions;
using server.Models.DTOs;
using server.Models.Entities;
using server.Repositories;
using server.Services.Interfaces;
using System.Collections.Generic;

namespace server.Tests.Controller
{
    public class ScoreControllerTests
    {
        private ScoreController _scoreController;
        private IScoreRepository _scoreRepository;
        private IAuthService _authService;

        public ScoreControllerTests()
        {
            _scoreRepository = A.Fake<IScoreRepository>();
            _authService = A.Fake<IAuthService>();

            _scoreController = new ScoreController(_scoreRepository, _authService);
        }

        [Fact]
        public async Task ScoreController_GetScores_ReturnsOk()
        {
            // Arrange
            var scores = A.Fake<IEnumerable<Score>>();
            A.CallTo(() => _scoreRepository.GetScoresAsync()).Returns(scores);

            // Act
            var result = await _scoreController.GetScores();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<OkObjectResult>();

            var okResult = result as OkObjectResult; // Cast to OkObjectResult
            okResult.Should().NotBeNull(); // Ensure okResult is not null
            okResult!.Value.Should().BeAssignableTo<IEnumerable<ScoreDTO>>(); // Check if the value is of type IEnumerable<ScoreDTO>
        }

        [Fact]
        public void ScoreController_GetScores_AuthorizeAttributeWithAdminRole()
        {
            // Arrange
            var methodInfo = typeof(ScoreController).GetMethod(nameof(_scoreController.GetScores));
            Assert.NotNull(methodInfo);  // Ensure methodInfo is not null

            // Act
            var result = (AuthorizeAttribute)methodInfo.GetCustomAttributes(typeof(AuthorizeAttribute), false)[0];

            // Assert
            result.Should().NotBeNull();
            result.Roles.Should().Be("Admin");
        }

        [Fact]
        public async Task ScoreController_GetScoreLeaderboard_ReturnsOk()
        {
            // Arrange
            var scores = A.Fake<IEnumerable<Score>>();
            A.CallTo(() => _scoreRepository.GetScoresAsync()).Returns(scores);

            // Act
            var result = await _scoreController.GetScoreLeaderboard();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<OkObjectResult>();

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeAssignableTo<IEnumerable<ScoreDTO>>();
        }


        [Fact]
        public async Task ScoreController_GetScoresByUserId_ReturnsForbidWhenUserIsNotAuthorized()
        {
            // Arrange
            var userId = 1;
            A.CallTo(() => _authService.IsUserAuthorized(userId)).Returns(false);

            // Act
            var result = await _scoreController.GetScoresByUserId(userId);

            // Assert
            result.Should().BeOfType<ForbidResult>();
        }

        [Fact]

        public async Task ScoreController_GetScoresByUserId_ReturnsNotFoundWhenNoScoresFound()
        {
            // Arrange
            var userId = 1;
            A.CallTo(() => _authService.IsUserAuthorized(userId)).Returns(true);
            A.CallTo(() => _scoreRepository.GetScoresByUserIdAsync(userId)).Returns(Task.FromResult<IEnumerable<Score>>(null));

            // Act
            var result = await _scoreController.GetScoresByUserId(userId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task ScoreController_GetScoresByUserId_ReturnsOk()
        {
            // Arrange
            var userId = 1;
            IEnumerable<Score> scores = new List<Score>
            {
                new Score
                {
                    Id = 1,
                    UserId = userId,
                    CorrectWords = 78,
                    IncorrectWords = 2,
                    Characters = 301,
                    CreatedDate = DateTime.Now
                },
                new Score
                {
                    Id = 2,
                    UserId = userId,
                    CorrectWords = 69,
                    IncorrectWords = 4,
                    Characters = 276,
                    CreatedDate = DateTime.Now
                }
            };
            var scoreDTOs = scores.ConvertToDTO();

            A.CallTo(() => _authService.IsUserAuthorized(userId)).Returns(true);
            A.CallTo(() => _scoreRepository.GetScoresByUserIdAsync(userId)).Returns(Task.FromResult(scores));

            // Act
            var result = await _scoreController.GetScoresByUserId(userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<OkObjectResult>();

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeAssignableTo<IEnumerable<ScoreDTO>>();
            okResult.Value.Should().BeEquivalentTo(scoreDTOs, options => options.WithStrictOrdering());
        }

        [Fact]
        public async Task ScoreController_GetScore_ReturnsNotFoundWhenScoreDoesNotExist()
        {
            // Arrange
            var scoreId = 1;

            A.CallTo(() => _scoreRepository.GetScoreByIdAsync(scoreId)).Returns(Task.FromResult<Score?>(null));

            // Act
            var result = await _scoreController.GetScore(scoreId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public void ScoreController_GetScore_AuthorizeAttributeWithAdminRole()
        {
            // Arrange
            var methodInfo = typeof(ScoreController).GetMethod(nameof(ScoreController.GetScore));
            Assert.NotNull(methodInfo);  // Ensure methodInfo is not null

            // Act
            var result = (AuthorizeAttribute)methodInfo.GetCustomAttributes(typeof(AuthorizeAttribute), false).First();

            // Assert
            result.Should().NotBeNull();
            result!.Roles.Should().Be("Admin");
        }

        [Fact]
        public async Task ScoreController_GetScore_ReturnsOk()
        {
            // Arrange
            var scoreId = 1;
            var score = new Score
            {
                Id = scoreId,
                CorrectWords = 100,
                IncorrectWords = 5,
                Characters = 400,
                CreatedDate = DateTime.Now
            };
            var scoreDTO = score.ConvertToDTO();

            A.CallTo(() => _scoreRepository.GetScoreByIdAsync(scoreId)).Returns(Task.FromResult<Score?>(score));

            // Act
            var result = await _scoreController.GetScore(scoreId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<OkObjectResult>();

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeAssignableTo<ScoreDTO>();
            okResult.Value.Should().BeEquivalentTo(scoreDTO);
        }

        [Fact]
        public async Task ScoreController_CreateScore_ReturnsCreatedAtAction()
        {
            // Arrange
            var score = A.Fake<Score>();
            var createScoreDTO = A.Fake<CreateScoreDTO>();
            var scoreDTO = score.ConvertToDTO();

            A.CallTo(() => _scoreRepository.CreateScoreAsync(score)).Returns(Task.FromResult(score));
            A.CallTo(() => _authService.IsUserAuthorized(score.UserId)).Returns(true);

            // Act
            var result = await _scoreController.CreateScore(createScoreDTO);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<CreatedAtActionResult>();

            var createdAtActionResult = result as CreatedAtActionResult;
            createdAtActionResult.Should().NotBeNull();
            createdAtActionResult!.Value.Should().BeAssignableTo<ScoreDTO>();
            createdAtActionResult.Value.Should().BeEquivalentTo(scoreDTO);
        }
    }
}
