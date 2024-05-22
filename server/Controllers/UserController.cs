﻿using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Extensions;
using server.Models;
using server.Models.DTOs;
using server.Models.Entities;
using server.Services;
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
        var users = await _userRepository.GetUsers();

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
        var user = await _userRepository.GetUserById(id);

        if (user == null)
        {
            return NotFound();
        }
        var userDTO = user.ConvertToDTO();
        return Ok(userDTO);
    }

    [HttpPut()]
    public async Task<ActionResult<User>> UpdateUser([FromBody] User user)
    {
        if (!_authService.IsUserAuthorized(user.Id))
        {
            return Forbid();
        }

        if (await _userService.IsEmailTakenAsync(user.Email))
        {
            return BadRequest("Email is already taken.");
        }

        if (await _userService.IsUsernameTakenAsync(user.Username))
        {
            return BadRequest("Username is already taken.");
        }

        var updatedUser = await _userRepository.UpdateUser(user);
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

        var deletedUser = await _userRepository.DeleteUser(id);
        if (deletedUser == null)
        {
            return NotFound();
        }
        var userDTO = deletedUser.ConvertToDTO();
        return Ok(userDTO);
    }
}
