using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.Repositories;

public class ScoreRepository: IScoreRepository
{
	private readonly SpeedTyperDbContext _context;
	public ScoreRepository(SpeedTyperDbContext speedTyperDbContext)
	{
		_context = speedTyperDbContext;
	}
    public async Task<IEnumerable<Score>> GetScores()
    {
        return await _context.Scores.ToListAsync();
    }

    public async Task<IEnumerable<Score>> GetScoresByUserId(int id)
    {
        return await _context.Scores.Where(s => s.UserId == id).ToListAsync();
    }

    public async Task<Score> GetScoreById(int id)
    {
        return await _context.Scores.FindAsync(id);
    }

    public async Task<Score> CreateScore(Score score)
    {
        var result = await _context.Scores.AddAsync(score);
        await _context.SaveChangesAsync();
        return result.Entity;
    }

}
