using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiceController : ControllerBase
    {
        private readonly IDiceService _diceService;
        public DiceController(IDiceService service)
        {
            _diceService = service;
        }
        [HttpPost("roll")]
        public async Task<ActionResult> RollDie([FromBody] DiceDto dice)
        {
            try
            {
                var result = await _diceService.RollDie(dice.Sides);
                return Ok(new { result, sides = dice.Sides});
            }
            catch(Exception e)
            {
                return BadRequest("Failed to roll die");
            }
        }
    }
}
