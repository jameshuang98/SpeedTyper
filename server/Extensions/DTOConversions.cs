using server.Models.DTOs;
using server.Models.Entities;

namespace server.Extensions;

public static class DTOConversions
{
    public static UserDTO ConvertToDTO(this User user)
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
    public static ScoreDTO ConvertToDTO(this Score score)
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

    public static IEnumerable<UserDTO> ConvertToDTO(this IEnumerable<User> users)
    {
        var userDTOs = new List<UserDTO>();
        foreach (var user in users)
        {
            var userDTO = user.ConvertToDTO();
            userDTOs.Add(userDTO);
        }
        return userDTOs;
    }

    public static IEnumerable<ScoreDTO> ConvertToDTO(this IEnumerable<Score> scores)
    {
        var scoreDTOs = new List<ScoreDTO>();
        foreach (var score in scores)
        {
            var scoreDTO = score.ConvertToDTO();
            scoreDTOs.Add(scoreDTO);
        }
        return scoreDTOs;
    }
}
