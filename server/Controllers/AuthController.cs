using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models;
using server.Repositories;
using server.Extensions;
using server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[AllowAnonymous]
[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;

    public AuthController(IUserRepository userRepository, IAuthService authService)
    {
        _userRepository = userRepository;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> RegisterUser([FromBody] UserRegistrationRequest userRegistrationRequest)
    {
        var newUser = await _userRepository.RegisterUser(userRegistrationRequest);
        if (newUser == null)
        {
            return BadRequest("Failed to register user");
        }
        string token = _authService.GenerateToken(newUser);
        
        return CreatedAtAction("GetUser", "User", new { id = newUser.Id }, token);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUser(UserLoginRequest userLoginRequest)
    {
        var loggedInUser = await _userRepository.LoginUser(userLoginRequest);
        if (loggedInUser == null)
        {
            return BadRequest("Failed to login user");
        }
        string token = _authService.GenerateToken(loggedInUser);
        return Ok(token);
    }
}
