using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using PenToPublic.Data;
using PenToPublic.Models;
using PenToPublic.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PenToPublic.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PenToPublicContext _context;
        private readonly IConfiguration _config;

        public AuthController(PenToPublicContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto login)
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.UserName == login.UserName && a.Password == login.Password);

            if (admin != null)
            {
                var token = GenerateJwtToken(admin.AdminId.ToString(), "admin", admin.UserName);
                return Ok(new LoginResponseDto
                {
                    Token = token,
                    Role = "admin",
                    UserName = admin.UserName
                });
            }

            var reg = await _context.Registrations
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserName == login.UserName && r.Password == login.Password);

            if (reg != null && reg.User != null)
            {
                var token = GenerateJwtToken(
                    reg.User.UserId.ToString(),
                    reg.User.Role,
                    reg.User.UserId.ToString()
                );

                return Ok(new LoginResponseDto
                {
                    Token = token,
                    Role = reg.User.Role,
                    UserName = reg.User.UserId.ToString()
                });
            }

            return Unauthorized("Invalid username or password.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto model)
        {
            var role = model.Role?.ToLower();

            if (string.IsNullOrWhiteSpace(role) || !new[] { "admin", "author", "reader" }.Contains(role))
                return BadRequest("Invalid role.");

            if (await _context.Registrations.AnyAsync(r => r.UserName == model.UserName || r.Email == model.Email))
                return BadRequest("Username or email already exists.");

            if (role == "admin")
            {
                if (await _context.Admins.AnyAsync(a => a.UserName == model.UserName))
                    return BadRequest("Admin username already exists.");

                var newAdmin = new Admin
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    Password = model.Password
                };

                _context.Admins.Add(newAdmin);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Admin registered successfully.",
                    UserId = newAdmin.AdminId,
                    Role = "admin"
                });
            }

            // For reader or author
            var registration = new Registration
            {
                Email = model.Email,
                UserName = model.UserName,
                Password = model.Password
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();

            var user = new User
            {
                RegId = registration.RegId,
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (role == "reader")
            {
                _context.ReaderDetails.Add(new ReaderDetail
                {
                    UserId = user.UserId,
                    IsSubscribed = model.IsSubscribed ?? false
                });
            }
            else if (role == "author")
            {
                _context.AuthorDetails.Add(new AuthorDetail
                {
                    UserId = user.UserId,
                    Bio = model.Bio
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "User registered successfully.",
                UserId = user.UserId,
                Role = user.Role
            });
        }

        private string GenerateJwtToken(string userId, string role, string userName)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.Name, userName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiresInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
