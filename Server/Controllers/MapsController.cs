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
    public class MapsController : ControllerBase
    {
        private readonly IMapRepository _repo;
        private readonly IWebHostEnvironment _env;

        public MapsController(IMapRepository repo, IWebHostEnvironment env)
        {
            _repo = repo;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> UploadMap([FromForm] IFormFile file, [FromForm] string name)
        {
            if (file == null || file.Length == 0) return BadRequest("No file selected.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type. Only images are allowed.");

            var uploadPath = Path.Combine(_env.WebRootPath, "uploads", "maps");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var fullPath = Path.Combine(uploadPath, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var map = new Map
            {
                Name = name,
                FilePath = $"/uploads/maps/{uniqueFileName}",
                UserId = userId
            };

            var result = await _repo.AddMapAsync(map);
            var mapDto = new
            {
                Id = result.Id,
                Name = result.Name,
                FilePath = result.FilePath
            };
            return Ok(mapDto);
        }
        [HttpGet]
        public async Task<IActionResult> GetMyMaps()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var maps = await _repo.GetUserMapsAsync(userId);
            var mapDtos = maps.Select(m => new MapDto
            {
                Id = m.Id,
                Name = m.Name,
                FilePath = m.FilePath
            });

            return Ok(mapDtos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMap(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var map = await _repo.GetMapByIdAsync(id);
            if (map == null || map.UserId != userId) return NotFound();

            var success = await _repo.DeleteMapAsync(id, userId);

            if (success)
            {
                var physicalPath = Path.Combine(_env.WebRootPath, map.FilePath.TrimStart('/'));
                if (System.IO.File.Exists(physicalPath)) System.IO.File.Delete(physicalPath);

                return Ok(new { message = "Map deleted" });
            }

            return BadRequest("Could not delete map.");
        }
    }
}
