using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class UserDto
{
    [Required]
    [StringLength(20, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 20 characters.")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = string.Empty;
}
