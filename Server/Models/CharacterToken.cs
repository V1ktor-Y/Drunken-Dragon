using System;

namespace Server.Models;

public class CharacterToken
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public int MaxHp { get; set; }
    public int Speed { get; set; }
    public int ArmorClass { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }
}
