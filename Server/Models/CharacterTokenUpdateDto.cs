using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class CharacterTokenUpdateDto
{
    public int Id { get; set; }

    [StringLength(50, MinimumLength = 1)]
    public string? Name { get; set; }

    public IFormFile? Icon { get; set; }

    public string? Class { get; set; }

    [Range(1, 1000)]
    public int? MaxHp { get; set; }

    [Range(0, 999)]
    public int? CurrentHp { get; set; }

    [Range(0, 100)]
    public int? Speed { get; set; }

    [Range(0, 50)]
    public int? ArmorClass { get; set; }
}
