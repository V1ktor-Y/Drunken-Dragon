using System;
using Server.Models;

namespace Server.Services;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<IEnumerable<User>> GetUsersAsync();
    Task<User?> GetUserByEmailAsync(string email);
    void Add(User user);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> SaveAllAsync();
}
