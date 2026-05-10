using System;

namespace Server.Models;

public class Map
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // This stores "/uploads/maps/unique-name.jpg"
    public string FilePath { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
