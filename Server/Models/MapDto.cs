using System;

namespace Server.Models;

public class MapDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public string FilePath { get; set; } = string.Empty;

}
