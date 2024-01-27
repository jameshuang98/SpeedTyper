namespace server.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Username { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string ProfileImageURL { get; set; } = String.Empty;
    }
}
