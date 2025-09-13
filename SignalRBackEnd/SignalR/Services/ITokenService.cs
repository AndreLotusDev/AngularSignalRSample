using SignalR.Models;

namespace SignalR.Services
{
    public interface ITokenService
    {
        TokenResponse GenerateForUser(string username);
    }
}
