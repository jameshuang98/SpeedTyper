namespace server.Models.DTOs;

public class CreateScoreDTO
{
    public int UserId { get; set; }
    public int CorrectWords { get; set; }
    public int IncorrectWords { get; set; }
    public int Characters { get; set; }
}
