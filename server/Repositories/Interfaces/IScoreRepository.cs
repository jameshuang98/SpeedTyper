using System;
using server.Models.Entities;

namespace server.Repositories;

public interface IScoreRepository
{
    Task<IEnumerable<Score>> GetScores();
    Task<IEnumerable<Score>> GetScoresByUserId(int id);
    Task<Score?> GetScoreById(int id);
    Task<Score> CreateScore(Score score);
}
