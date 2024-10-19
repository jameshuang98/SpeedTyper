using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Repositories;
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
    private readonly IUserService _userService;

    public AuthController(IUserRepository userRepository, IAuthService authService, IUserService userService)
    {
        _userRepository = userRepository;
        _authService = authService;
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<string>> RegisterUser([FromBody] UserRegistrationRequestDTO userRegistrationRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (await _userService.IsEmailTakenAsync(userRegistrationRequest.Email))
        {
            return BadRequest("Email is already taken.");
        }

        if (await _userService.IsUsernameTakenAsync(userRegistrationRequest.Username))
        {
            return BadRequest("Username is already taken.");
        }

        var newUser = await _authService.RegisterUserAsync(userRegistrationRequest);
        if (newUser == null)
        {
            return BadRequest("Failed to register user");
        }

        string token = _authService.GenerateToken(newUser);
        return CreatedAtAction("GetUser", "User", new { id = newUser.Id }, token);
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> LoginUser(UserLoginRequestDTO userLoginRequest)
    {
        var loggedInUser = await _authService.LoginUserAsync(userLoginRequest.Identifier, userLoginRequest.Password);
        if (loggedInUser == null)
        {
            return Unauthorized("Invalid credentials");
        }
        string token = _authService.GenerateToken(loggedInUser);
        return Ok(token);
    }
}
