using System;

namespace Server.Services;

public interface IDiceService
{
    Task<int> RollDie(int id);
}
