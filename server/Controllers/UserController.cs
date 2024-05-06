using Microsoft.AspNetCore.Mvc;
using server.Extensions;
using server.Models;
using server.Models.DTOs;
using server.Models.Entities;

namespace server.Repositories;

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
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
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
    public async Task<ActionResult<UserDTO>> GetUser(int id)
    {
        var user = await _userRepository.GetUserById(id);

        if (user == null)
        {
            return NotFound();
        }
        var userDTO = user.ConvertToDTO();
        return Ok(userDTO);
    }

    [HttpPatch()]
    public async Task<ActionResult<UserDTO>> UpdateUser([FromBody] User user)
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
    public async Task<ActionResult<UserDTO>> DeleteUser(int id)
    {
        var deletedUser = await _userRepository.DeleteUser(id);
        if (deletedUser == null)
        {
            return NotFound();
        }
        var userDTO = deletedUser.ConvertToDTO();
        return Ok(userDTO);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> RegisterUser([FromBody] UserRegistrationRequest userRegistrationRequest)
    {
        var newUser = await _userRepository.RegisterUser(userRegistrationRequest);
        if (newUser == null)
        {
            return BadRequest("Failed to register user");
        }
        var userDTO = newUser.ConvertToDTO();
        return CreatedAtAction(nameof(GetUser), new { id = userDTO.Id }, userDTO);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUser(UserLoginRequest userLoginRequest)
    {
        var authentication = await _userRepository.LoginUser(userLoginRequest);
        if (authentication == null || (bool)!authentication)
            return Unauthorized();
        return Ok(authentication);
    }
}
