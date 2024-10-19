namespace server.Models.DTOs;

public class UserDTO
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ProfileImageURL { get; set; } = string.Empty;
}
