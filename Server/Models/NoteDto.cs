using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class NoteDto
{
    [Required]
    public string Content { get; set; }
}
