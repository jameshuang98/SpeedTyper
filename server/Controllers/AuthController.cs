using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models;
using server.Repositories;
using server.Extensions;

namespace server.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    public AuthController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
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
        return CreatedAtAction("GetUser", "UserController", new { id = userDTO.Id }, userDTO);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUser(UserLoginRequest userLoginRequest)
    {
        var authentication = await _userRepository.LoginUser(userLoginRequest);
        if (authentication == null)
        {
            return BadRequest("Failed to login user");
        }
        if ((bool)!authentication)
        {
            return Unauthorized("Invalid email or password");
        }
        return Ok(authentication);
    }
}
