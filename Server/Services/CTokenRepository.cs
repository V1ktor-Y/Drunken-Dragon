using System;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;

public class CTokenRepository : ICTokenRepository
{
    private readonly AppDbContext _context;

    public CTokenRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<CharacterToken>> GetUserTokensAsync(int userId)
    {
        return await _context.CharacterTokens
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }

    public async Task<CharacterToken> CreateTokenAsync(CharacterToken token)
    {
        _context.CharacterTokens.Add(token);
        await _context.SaveChangesAsync();
        return token;
    }
    public async Task<CharacterToken?> GetTokenByIdAsync(int tokenId, int userId)
    {
        return await _context.CharacterTokens
            .FirstOrDefaultAsync(t => t.Id == tokenId && t.UserId == userId);
    }
    public async Task<bool> UpdateTokenAsync(CharacterToken token)
    {
        _context.CharacterTokens.Update(token);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteTokenAsync(int tokenId, int userId)
    {
        var token = await _context.CharacterTokens
            .FirstOrDefaultAsync(t => t.Id == tokenId && t.UserId == userId);

        if (token == null) return false;

        _context.CharacterTokens.Remove(token);
        return await _context.SaveChangesAsync() > 0;
    }
}
