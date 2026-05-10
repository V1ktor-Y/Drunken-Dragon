using System;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;

public class NotesRepository : INotesRepository
{
    private readonly AppDbContext _context;
    public NotesRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Note?> GetByUserIdAsync(int userId)
    {
        return await _context.Notes
            .FirstOrDefaultAsync(n => n.UserId == userId);
    }

    public async Task UpdateAsync(int userId, string content)
    {
        var existingNote = await _context.Notes
            .FirstOrDefaultAsync(n => n.UserId == userId);

        if(existingNote == null)
        {
            var newNote = new Note
            {
                UserId = userId,
                Content = content
            };
            await _context.Notes.AddAsync(newNote);
        }
        else
        {
            existingNote.Content = content;
        }
        await _context.SaveChangesAsync();
    }
}
