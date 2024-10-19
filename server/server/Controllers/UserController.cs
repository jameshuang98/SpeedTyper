using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using server.Extensions;
using server.Models.DTOs;
using server.Services.Interfaces;

namespace server.Repositories;

[Authorize]
[Route("[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public UserController(IUserRepository userRepository, IAuthService authService, IUserService userService)
    {
        _userRepository = userRepository;
        _authService = authService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
    {
        var users = await _userRepository.GetUsersAsync();

        if (users == null)
        {
            return NotFound();
        }
        var userDTOs = users.ConvertToDTO();
        return Ok(userDTOs);
    }

    [HttpGet("{id:int}", Name = "GetUser")]
    public async Task<ActionResult<UserDTO>> GetUser(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }
        var userDTO = user.ConvertToDTO();
        return Ok(userDTO);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<string>> UpdateUser(int id, [FromBody] JsonPatchDocument<UserDTO> patchDoc)
    {
        if (patchDoc == null)
        {
            return BadRequest();
        }

        if (!_authService.IsUserAuthorized(id))
        {
            return Forbid();
        }

        var userToUpdate = await _userRepository.GetUserByIdAsync(id);
        if (userToUpdate == null)
        {
            return NotFound();
        }
        var userDTO = userToUpdate.ConvertToDTO();

        var emailOperation = patchDoc.Operations.FirstOrDefault(op => op.path.Equals("/email", StringComparison.OrdinalIgnoreCase));
        var usernameOperation = patchDoc.Operations.FirstOrDefault(op => op.path.Equals("/username", StringComparison.OrdinalIgnoreCase));

        // Validate email if it is being changed and not null
        if (emailOperation != null && emailOperation.value != null)
        {
            var newEmail = emailOperation.value.ToString();
            if (await _userService.IsEmailTakenAsync(newEmail!))
            {
                return BadRequest("Email is already taken.");
            }
        }

        // Validate username if it is being changed and not null
        if (usernameOperation != null && usernameOperation.value != null)
        {
            var newUsername = usernameOperation.value.ToString();
            if (await _userService.IsUsernameTakenAsync(newUsername!))
            {
                return BadRequest("Username is already taken.");
            }
        }

        patchDoc.ApplyTo(userDTO, (error) =>
        {
            ModelState.AddModelError(error.AffectedObject?.ToString() ?? string.Empty, error.ErrorMessage);
        });

        if (!TryValidateModel(userDTO))
        {
            return BadRequest(ModelState);
        }

        var updatedUser = await _userRepository.UpdateUserAsync(id, userDTO);
        if (updatedUser == null)
        {
            return NotFound();
        }

        string token = _authService.GenerateToken(updatedUser);
        return Ok(token);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<UserDTO>> DeleteUser(int id)
    {
        if (!_authService.IsUserAuthorized(id))
        {
            return Forbid();
        }

        var deletedUser = await _userRepository.DeleteUserAsync(id);
        if (deletedUser == null)
        {
            return NotFound();
        }
        var userDTO = deletedUser.ConvertToDTO();
        return Ok(userDTO);
    }
}
