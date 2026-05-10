using System;
using Server.Models;

namespace Server.Services;

public interface ICTokenRepository
{
    Task<IEnumerable<CharacterToken>> GetUserTokensAsync(int userId);
    Task<CharacterToken> CreateTokenAsync(CharacterToken token);
    Task<bool> UpdateTokenAsync(CharacterToken token);
    Task<bool> DeleteTokenAsync(int tokenId, int userId);
    Task<CharacterToken?> GetTokenByIdAsync(int tokenId, int userId);
}
