using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class DiceDto
{
    [Required(ErrorMessage = "You must specify the number of sides.")]
    [Range(2, int.MaxValue-1, ErrorMessage = "Dice must have atleast 2 sides.")]
    public int Sides { get; set; }
}
