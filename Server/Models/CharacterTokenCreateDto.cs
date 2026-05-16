using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class CharacterTokenCreateDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    public IFormFile? Icon { get; set; }

    [Required]
    public string Class { get; set; } = string.Empty;
    public string Note {get;set;} = string.Empty;

    [Required]
    [Range(1, 1000, ErrorMessage = "Max HP must be between 1 and 1000")]
    public int MaxHp { get; set; }

    [Required]
    [Range(0, 100, ErrorMessage = "Speed must be a positive number")]
    public int Speed { get; set; }

    [Required]
    [Range(0, 50, ErrorMessage = "AC must be between 0 and 50")]
    public int ArmorClass { get; set; }
}
