using Microsoft.AspNetCore.Mvc;
using server.Entities;
using server.Extensions;
using server.Repositories;

[Route("[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _userRepository.GetUsers();

        if (users == null)
        {
            return NotFound();
        }
        var userDTOs = users.ConvertToDTO();
        return Ok(userDTOs);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userRepository.GetUserById(id);

        if (user == null)
        {
            return NotFound();
        }
        var userDTO = user.ConvertToDTO();
        return Ok(userDTO);
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] User user)
    {
        var newUser = await _userRepository.CreateUser(user);
        if (newUser == null)
        {
            return NoContent();
        }
        var userDTO = newUser.ConvertToDTO();
        return CreatedAtAction(nameof(GetUser), new { id = userDTO.Id}, userDTO);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<User>> UpdateUser(int id, [FromBody] User user)
    {
        var updatedUser = await _userRepository.UpdateUser(user);
        if (updatedUser == null)
        {
            return NotFound();
        }
        var userDTO = updatedUser.ConvertToDTO();
        return Ok(userDTO);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<User>> DeleteUser(int id)
    {
        var deletedUser = await _userRepository.DeleteUser(id);
        if (deletedUser == null)
        {
            return NotFound();
        }
        var userDTO = deletedUser.ConvertToDTO();
        return Ok(userDTO);
    }

}
