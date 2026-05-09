using System;
using Server.Models;

namespace Server.Services;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<IEnumerable<User>> GetUsersAsync();
    void Add(User user);
    Task<bool> SaveAllAsync();
}
