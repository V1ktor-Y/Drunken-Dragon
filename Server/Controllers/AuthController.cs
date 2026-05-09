using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _repo;
        private readonly IPasswordHasher<User> _passwordHasher;
        public AuthController(IConfiguration configuration, IUserRepository repository, IPasswordHasher<User> passwordHasher)
        {
            _config = configuration;
            _repo = repository;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto login)
        {
            var user = await _repo.GetUserByUsernameAsync(login.Username);

            if (user == null) return Unauthorized("Invalid Username!");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid password!");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(4),
                signingCredentials: creds
            );

            return Ok(new
            {
                username = user.Username,
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto loginDto)
        {
            if (loginDto == null)
                return BadRequest("Login must contain username and password.");

            if (await _repo.GetUserByUsernameAsync(loginDto.Username) != null)
                return BadRequest("Username is taken");

            var user = new User
            {
                Username = loginDto.Username,
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, loginDto.Password);

            _repo.Add(user);

            if (await _repo.SaveAllAsync())
                return Ok(user.Username);

            return BadRequest("Failed to register user");
        }
    }
}
