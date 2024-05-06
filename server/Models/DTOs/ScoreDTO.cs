namespace server.Models.DTOs;

public class ScoreDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CorrectWords { get; set; }
    public int IncorrectWords { get; set; }
    public int Characters { get; set; }
    public DateTime CreatedDate { get; set; }
}
