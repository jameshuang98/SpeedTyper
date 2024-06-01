using Microsoft.AspNetCore.Mvc;
using server.Repositories;
using server.Extensions;
using server.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using server.Services.Interfaces;
using server.Models.DTOs;

namespace server.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class ScoreController : ControllerBase
{
    private readonly IScoreRepository _scoreRepository;
    private readonly IAuthService _authService;

    public ScoreController(IScoreRepository scoreRepository, IAuthService authService)
    {
        _scoreRepository = scoreRepository;
        _authService = authService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet()]
    public async Task<ActionResult<IEnumerable<Score>>> GetScores()
    {
        var scores = await _scoreRepository.GetScoresAsync();
        if (scores == null)
        {
            return NotFound();
        }
        var scoreDTOs = scores.ConvertToDTO();
        return Ok(scoreDTOs);
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<IEnumerable<Score>>> GetScoreLeaderboard()
    {
        var scores = await _scoreRepository.GetScoresAsync();
        if (scores == null)
        {
            return NotFound();
        }

        var scoreDTOs = scores.OrderBy(s => s.CorrectWords).Take(10).ConvertToDTO();
        return Ok(scoreDTOs);
    }

    [HttpGet("GetUserScores/{userId:int}")]
    public async Task<ActionResult<IEnumerable<Score>>> GetScoresByUserId(int userId)
    {
        if (!_authService.IsUserAuthorized(userId))
        {
            return Forbid();
        }

        var scores = await _scoreRepository.GetScoresByUserIdAsync(userId);
        if (scores == null)
        {
            return NotFound();
        }
        var scoreDTOs = scores.ConvertToDTO();
        return Ok(scoreDTOs);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Score>> GetScore(int id)
    {
        var score = await _scoreRepository.GetScoreByIdAsync(id);
        if (score == null)
        {
            return NotFound();
        }
        var scoreDTO = score.ConvertToDTO();
        return Ok(scoreDTO);
    }

    [HttpPost]
    public async Task<ActionResult<Score>> CreateScore([FromBody] CreateScoreDTO createScoreDTO)
    {
        if (!_authService.IsUserAuthorized(createScoreDTO.UserId))
        {
            return Forbid();
        }

        var score = new Score
        {
            UserId = createScoreDTO.UserId,
            CorrectWords = createScoreDTO.CorrectWords,
            IncorrectWords = createScoreDTO.IncorrectWords,
            Characters = createScoreDTO.Characters,
            CreatedDate = DateTime.Now
        };

        var newScore = await _scoreRepository.CreateScoreAsync(score);
        if (newScore == null)
        {
            return NoContent();
        }
        var scoreDTO = newScore.ConvertToDTO();
        return CreatedAtAction(nameof(GetScore), new { id = scoreDTO.Id }, scoreDTO);
    }
}
