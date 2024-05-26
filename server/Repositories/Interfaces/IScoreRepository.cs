using server.Models.Entities;

namespace server.Repositories;

public interface IScoreRepository
{
    Task<IEnumerable<Score>> GetScoresAsync();
    Task<IEnumerable<Score>> GetScoresByUserIdAsync(int id);
    Task<Score?> GetScoreByIdAsync(int id);
    Task<Score> CreateScoreAsync(Score score);
}
