using System;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByIdAsync(int id) =>
        await _context.Users.FindAsync(id);

    public async Task<User?> GetUserByUsernameAsync(string username) =>
        await _context.Users.SingleOrDefaultAsync(x => x.Username == username);

    public async Task<User?> GetUserByEmailAsync(string email)
{
    return await _context.Users
        .Include(u => u.Note) 
        .FirstOrDefaultAsync(u => u.Email == email.ToLower());
}
    public async Task<IEnumerable<User>> GetUsersAsync() =>
        await _context.Users.ToListAsync();

    public void Add(User user) => _context.Users.Add(user);
    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
    }
    public async Task<bool> SaveAllAsync() =>
        await _context.SaveChangesAsync() > 0;
}
