using System;

namespace Server.Services;

public class DiceService : IDiceService
{
    public async Task<int> RollDie(int id)
    {
        var rand = new Random();
        return rand.Next(1,id+1);
    }
}
