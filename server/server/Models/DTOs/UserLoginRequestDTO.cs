﻿namespace server.Models.DTOs;

public class UserLoginRequestDTO
{
    public string Identifier { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}