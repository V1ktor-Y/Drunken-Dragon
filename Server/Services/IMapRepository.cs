using System;
using Server.Models;

namespace Server.Services;

public interface IMapRepository
{
    Task<Map> AddMapAsync(Map map);
    Task<IEnumerable<Map>> GetUserMapsAsync(int userId);
    Task<Map?> GetMapByIdAsync(int mapId);
    Task<bool> DeleteMapAsync(int mapId, int userId);
}
