using Microsoft.EntityFrameworkCore;
using server.Models.Entities;
using server.Repositories;

public class ScoreRepository: IScoreRepository
{
	private readonly SpeedTyperDbContext _context;
	public ScoreRepository(SpeedTyperDbContext speedTyperDbContext)
	{
		_context = speedTyperDbContext;
	}
    public async Task<IEnumerable<Score>> GetScoresAsync()
    {
        return await _context.Scores.ToListAsync();
    }

    public async Task<IEnumerable<Score>> GetScoresByUserIdAsync(int id)
    {
        return await _context.Scores.Where(s => s.UserId == id).ToListAsync();
    }

    public async Task<Score?> GetScoreByIdAsync(int id)
    {
        return await _context.Scores.FindAsync(id);
    }

    public async Task<Score> CreateScoreAsync(Score score)
    {
        var result = await _context.Scores.AddAsync(score);
        await _context.SaveChangesAsync();
        return result.Entity;
    }

}
