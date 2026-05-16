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
    public class CTokenController : ControllerBase
    {
        private readonly ICTokenRepository _repo;

        public CTokenController(ICTokenRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CharacterTokenGetDto>>> GetMyTokens()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var tokens = await _repo.GetUserTokensAsync(userId);

            var dtos = tokens.Select(t => new CharacterTokenGetDto
            {
                Id = t.Id,
                Name = t.Name,
                Icon = t.Icon,
                Class = t.Class,
                Note = t.Note,
                MaxHp = t.MaxHp,
                Speed = t.Speed,
                ArmorClass = t.ArmorClass
            });

            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<CharacterTokenGetDto>> CreateToken([FromForm] CharacterTokenCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            string iconPath = "/uploads/icons/default.png";

            if (dto.Icon != null && dto.Icon.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Icon.FileName)}";
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "icons");

                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                var fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.Icon.CopyToAsync(stream);
                }

                iconPath = $"/uploads/icons/{fileName}";
            }

            var token = new CharacterToken
            {
                Name = dto.Name,
                Icon = iconPath,
                Class = dto.Class,
                Note = dto.Note,
                MaxHp = dto.MaxHp,
                Speed = dto.Speed,
                ArmorClass = dto.ArmorClass,
                UserId = userId
            };

            var result = await _repo.CreateTokenAsync(token);
            var returnToken = new CharacterTokenGetDto
            {
                Id = result.Id,
                Name = result.Name,
                Icon = result.Icon,
                Class = result.Class,
                Note = result.Note,
                MaxHp = result.MaxHp,
                Speed = result.Speed,
                ArmorClass = result.ArmorClass
            };
            return Ok(returnToken);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToken(int id)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var success = await _repo.DeleteTokenAsync(id, userId);

            if (!success)
            {
                return NotFound(new { message = "Token not found!" });
            }

            return Ok(new { message = "Character token deleted successfully." });
        }
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateToken(int id, [FromForm] CharacterTokenUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var existingToken = await _repo.GetTokenByIdAsync(id, userId);

            if (existingToken == null) return NotFound();

            if (dto.Name != null) existingToken.Name = dto.Name;
            if (dto.Class != null) existingToken.Class = dto.Class;
            if (dto.Note != null) existingToken.Note = dto.Note;
            existingToken.MaxHp = dto.MaxHp ?? existingToken.MaxHp;
            existingToken.Speed = dto.Speed ?? existingToken.Speed;
            existingToken.ArmorClass = dto.ArmorClass ?? existingToken.ArmorClass;

            if (dto.Icon != null && dto.Icon.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Icon.FileName)}";
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/icons", fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.Icon.CopyToAsync(stream);
                }

                existingToken.Icon = $"/uploads/icons/{fileName}";
            }

            var success = await _repo.UpdateTokenAsync(existingToken);
            return success ? NoContent() : BadRequest("Update failed.");
        }
    }
}
