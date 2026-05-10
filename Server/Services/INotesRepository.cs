using System;
using Server.Models;

namespace Server.Services;

public interface INotesRepository
{
    Task<Note?> GetByUserIdAsync(int userId);
    Task UpdateAsync(int userId, string content);
}
