using server.DTOs;
using server.Entities;

namespace server.Extensions
{
    public static class DTOConversions
    {
        public static UserDTO ConvertToDto(this User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                ProfileImageURL = user.ProfileImageURL
            };
        }
        public static ScoreDTO ConvertToDto(this Score score)
        {
            return new ScoreDTO
            {
                Id = score.Id,
                UserId = score.UserId,
                CorrectWords = score.CorrectWords,
                IncorrectWords = score.IncorrectWords,
                Characters = score.Characters,
                CreatedDate = score.CreatedDate
            };
        }
    }
}
