using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly INotesRepository _noteRepository;
        public NotesController(INotesRepository repository)
        {
            _noteRepository = repository;
        }
        [HttpGet]
        public async Task<IActionResult> GetNote()
        {
            var userId = GetUserId();
            var note = await _noteRepository.GetByUserIdAsync(userId);

            return Ok(new { content = note?.Content ?? "" });
        }

        [HttpPut]
        public async Task<IActionResult> SaveNote([FromBody] NoteDto dto)
        {
            var userId = GetUserId();
            await _noteRepository.UpdateAsync(userId, dto.Content);
            return NoContent();
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }
    }
}
