using System;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;

public class MapRepository : IMapRepository
{
    private readonly AppDbContext _context;

    public MapRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Map> AddMapAsync(Map map)
    {
        _context.Maps.Add(map);
        await _context.SaveChangesAsync();
        return map;
    }

    public async Task<bool> DeleteMapAsync(int mapId, int userId)
    {
        var map = await _context.Maps.FirstOrDefaultAsync(m => m.Id == mapId && m.UserId == userId);
        if (map == null) return false;

        _context.Maps.Remove(map);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<Map?> GetMapByIdAsync(int mapId)
    {
        return await _context.Maps.FindAsync(mapId);
    }

    public async Task<IEnumerable<Map>> GetUserMapsAsync(int userId)
    {
        return await _context.Maps
            .Where(m => m.UserId == userId)
            .OrderBy(m=> m.Name)
            .ToListAsync();
    }
}
