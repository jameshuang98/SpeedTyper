namespace server.Entities;

public class Score
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CorrectWords { get; set; }
    public int IncorrectWords { get; set; }
    public int Characters { get; set; }
    public DateTime CreatedDate { get; set; }

    
    //[ForeignKey("UserId")]
    public User? User { get ; set; }
}
