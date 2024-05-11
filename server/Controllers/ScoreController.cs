using Microsoft.AspNetCore.Mvc;
using server.Repositories;
using server.Extensions;
using server.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class ScoreController : ControllerBase
{
    private readonly IScoreRepository _scoreRepository;

    public ScoreController(IScoreRepository scoreRepository)
    {
        _scoreRepository = scoreRepository;
    }

    [HttpGet()]
    public async Task<ActionResult<IEnumerable<Score>>> GetScores()
    {
        var scores = await _scoreRepository.GetScores();
        if (scores == null)
        {
            return NotFound();
        }
        var scoreDTOs = scores.ConvertToDTO();
        return Ok(scoreDTOs);
    }

    [HttpGet("/GetUserScores/{id:int}")]
    public async Task<ActionResult<IEnumerable<Score>>> GetScoresByUserId(int id)
    {
        var scores = await _scoreRepository.GetScoresByUserId(id);
        if (scores == null)
        {
            return NotFound();
        }
        var scoreDTOs = scores.ConvertToDTO();
        return Ok(scoreDTOs);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Score>> GetScore(int id)
    {
        var score = await _scoreRepository.GetScoreById(id);
        if (score == null)
        {
            return NotFound();
        }
        var scoreDTO = score.ConvertToDTO();
        return Ok(scoreDTO);
    }

    [HttpPost]
    public async Task<ActionResult<Score>> CreateScore([FromBody] Score score)
    {
        var newScore = await _scoreRepository.CreateScore(score);
        if (newScore == null)
        {
            return NoContent();
        }
        var scoreDTO = newScore.ConvertToDTO();
        return CreatedAtAction(nameof(GetScore), new { id = scoreDTO.Id }, scoreDTO);
    }
}
